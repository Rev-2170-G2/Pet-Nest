import { useState, useEffect, useContext } from 'react';
import {  Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useLocation, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import MapView from '../MapView/MapView';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import MultiInput from '../MultiInputs/MultiInputs';
// import './eventForm.css';


type EventType = {
  name: string;
  description: string;
  date: Date | string;
  photos: string[];
  location: google.maps.places.Place | string | null;
}

export default function eventForm() {
    const [selectedPlace, setSelectedPlace] = useState<google.maps.places.Place | null>(null);
    const [validated, setValidated] = useState<boolean>(false);
    const [date, setDate] = useState<Date>(new Date());
    const [photos, setPhotos] = useState<string[]>([]);

    const navigate = useNavigate();
    const loc = useLocation();

    const eventFromLoc = loc.state?.event;
    const [event, setevent] = useState<EventType>({
        name: eventFromLoc?.name ?? '',
        description: eventFromLoc?.description ?? '',
        date: eventFromLoc?.date ?? date,
        photos: eventFromLoc?.photos ?? photos,
        location: selectedPlace
    });
    const { user } = useContext(AuthContext);


    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setevent({ ...event, [e.target.name]: e.target.value });
    };

    // sync date and location and photos into event object
    // useEffect(() => {
    //   if (selectedPlace && selectedPlace.location) {
    //       setevent({ ...event, location: selectedPlace});
    //   }
    // }, [selectedPlace, setSelectedPlace]);

    // useEffect(() => {
    //   if (photos) {
    //     setevent({ ...event, photos});
    //   }
    // }, [photos])

    useEffect(() => {
      if(eventFromLoc) {
        setSelectedPlace(eventFromLoc.location);
        setevent({ ...event, location: eventFromLoc.location});
      }
    }, [loc])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const isFormValid = 
          event.name.trim() !== '' &&
          event.description.trim() !== '' &&
          (event.location || selectedPlace)&& 
          date && 
          photos;

        // change validated attribute before checking validity to ensure react processes a change in the virtual DOM
        setValidated(true); 

        if (!isFormValid) {
            e.stopPropagation();
            console.log('eventForm validation failed');
            return;

        } else if (isFormValid) {
          setValidated(true);
          console.log('eventForm validation passed');

          if (user) { 
            let formattedEvent = { ...event};
            if (!eventFromLoc) {
              formattedEvent.location = selectedPlace?.formattedAddress ?? event.location;
              if (date instanceof Date) formattedEvent.date = formatDate(date);
              else formattedEvent.date = event.date;
              formattedEvent.photos = photos;
              
              await axios
              .post(`${import.meta.env.VITE_BACKEND_URL}/events/`, formattedEvent, {
                headers: {
                  'Authorization': `Bearer ${user.token}`
                }
              })
              .then((res) => console.log(res))
              .catch((err) => console.error(JSON.stringify(err)))
              .finally(() => navigate('/'));

            } else {
              formattedEvent.location = selectedPlace?.formattedAddress ?? event.location;
              if (date instanceof Date) formattedEvent.date = formatDate(date);
              else formattedEvent.date = date;
              formattedEvent.photos = photos;

              await axios
              .patch(`${import.meta.env.VITE_BACKEND_URL}/events/${eventFromLoc.id}`, formattedEvent, {
                headers: {
                  'Authorization': `Bearer ${user.token}`
                }
              })
              .then((res) => console.log(res))
              .catch((err) => console.error(JSON.stringify(err)))
              .finally(() => navigate('/'));

            }
          }
        }
    }

  return (
    <>
   <Container className='mt-4 mw-75'>
    {eventFromLoc ? <h1>Update Event</h1> : <h1>Create Event</h1>}
      <Form noValidate onSubmit={handleSubmit} id='event-form'>
        <Row className='mb-3'>
          <Col>
            {/* event Name */}
            <Form.Group as={Row} className='mb-3' controlId='formBasicName'>
              <Form.Label column sm={3}>Name</Form.Label>
              <Col>
                <Form.Control
                  type='text'
                  placeholder='Enter event name'
                  value={event.name}
                  onChange={onChange}
                  name='name'
                  isInvalid={validated && event.name.trim() === ''}
                  isValid={validated && event.name.trim() !== ''}
                  required
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                <Form.Control.Feedback type='invalid'>
                  Please provide a name.
                </Form.Control.Feedback>
              </Col>
            </Form.Group>

            {/* Description */}
            <Form.Group as={Row} className='mb-3' controlId='formBasicDesc'>
              <Form.Label column sm={3}>Description</Form.Label>
              <Col>
                <Form.Control
                  as='textarea'
                  placeholder='Enter a description of the event'
                  value={event.description}
                  onChange={onChange}
                  name='description'
                  isInvalid={validated && event.description.trim() === ''}
                  isValid={validated && event.description.trim() !== ''}
                  required
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                <Form.Control.Feedback type='invalid'>
                  Please provide a description.
                </Form.Control.Feedback>
              </Col>
            </Form.Group>

            {/* MultiStringInput for Photo URLs */}
            <Form.Group className='mb-3' controlId='formBasicPhotoLinks'>
              <MultiInput label='Photos' onChange={setPhotos} preSet={event.photos ?? []}/>
              {validated && photos.length === 0 && (
                  <div className='invalid-feedback d-block'>Please add at least one photo link</div>
              )}
              {validated && photos.length > 0 && (
                  <div className='valid-feedback d-block'>Looks good!</div>
              )}
            </Form.Group>

            {/* Date */}
            <Form.Group className='mb-3' controlId='formDate'>
              <Form.Label>Date</Form.Label>
              <Col>
                <DatePicker selected={date} onChange={(date: Date | null | [Date | null, Date | null]) => {
                  if (date && !Array.isArray(date)) {
                    setDate(date);
                  }
                }} />
              </Col>
            </Form.Group>

          <Button variant='primary' type='submit'>
            Submit
          </Button>
          </Col>

          {/* Map Column */}
          <Col>
            <Form.Group className='mb-3' controlId='formMap'>
              <MapView showAutoComplete={true} setSelectedPlace={setSelectedPlace} selectedPlace={selectedPlace} width={'50vw'} height={'45vh'}/>
              {validated && !selectedPlace && (
                <div className='invalid-feedback d-block'>Please choose a location by searching</div>
              )}
              {validated && selectedPlace && (
                <div className='valid-feedback d-block'>Looks good!</div>
            )}
            </Form.Group>
          </Col>
        </Row>
        
      </Form>
    </Container>
    </>
  )
}

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};