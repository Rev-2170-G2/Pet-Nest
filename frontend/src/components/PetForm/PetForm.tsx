import { useState, useContext, useEffect } from 'react';
import {  Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useLocation, useNavigate } from "react-router-dom";
import MultiInput from '../MultiInputs/MultiInputs';
import MapView from '../../components/MapView/MapView';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
// import './PetForm.css';

export type Service = {
    service: string,
    price: number
}

type Pet = {
  name: string;
  type: string;
  description: string;
  services: Service[];
  photos: string[];
  location: google.maps.places.Place | string | null;
}

export default function PetForm() {
    const navigate = useNavigate();
    const loc = useLocation();
    const validTypes: string[] = ['Cat', 'Dog', 'Bird', 'Other'];

    const [services, setServices] = useState<Service[]>([]);
    const [selectedPlace, setSelectedPlace] = useState<google.maps.places.Place | null>(null);
    const [validated, setValidated] = useState<boolean>(false);
    const [photos, setPhotos] = useState<string[]>([]);

    const petFromLoc = loc.state?.pet;
    const [pet, setPet] = useState<Pet>({
      name: petFromLoc?.name ?? '',
      type: petFromLoc?.type ?? '',
      description: petFromLoc?.description ?? '',
      services: petFromLoc?.services ?? [],
      photos: petFromLoc?.photos ?? photos,
      location: petFromLoc?.location ?? null,
    });
    const { user } = useContext(AuthContext);
    

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setPet({ ...pet, [e.target.name as keyof Pet]: e.target.value });
    };

    // sync services and location and photos into pet object
    // useEffect(() => {
    //     setPet({...pet, services});
    // },[services]);

    // useEffect(() => {
    // if(selectedPlace && selectedPlace.location) {
    //     setPet({ ...pet, location: selectedPlace});
    //   }
    // }, [selectedPlace]);

    // useEffect(() => {
    //   if(photos.length > 0) {
    //     setPet({...pet, photos});
    //   }
    // }, [photos]);

    useEffect(() => {
      if (petFromLoc) {
        setPet({ ...pet, 
          location: petFromLoc.location
        });
        setSelectedPlace(petFromLoc.location);
      }
    }, [loc])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        e.preventDefault();
        const isFormValid = 
          pet.name.trim() !== '' &&
          validTypes.includes(pet.type) &&
          pet.description.trim() !== '' &&
          services &&
          photos &&
          location;

        // change validated attribute before checking validity to ensure react processes a change in the virtual DOM
        setValidated(true); 

        if (!isFormValid) {
            e.stopPropagation();
            console.log('PetForm validation failed');
            return;

        } else if (isFormValid){
          setValidated(true);
          console.log('PetForm validation passed');

          if (user) { 
            let formattedPet = { ...pet };
            if (!petFromLoc) {
              // formattedPet = {
              //   ...pet, 
              //   services,
              //   photos,
              //   location: selectedPlace?.formattedAddress ?? pet.location
              // };
              formattedPet.services = services;
              formattedPet.photos = photos;
              formattedPet.location = selectedPlace?.formattedAddress ?? pet.location
              
              await axios
              .post(`${import.meta.env.VITE_BACKEND_URL}/pets/`, formattedPet, {
                headers: {
                  'Authorization': `Bearer ${user.token}`
                }
              })
              .then((res) => console.log(res))
              .catch((err) => console.error(JSON.stringify(err)))
              .finally(() => navigate('/'));

            } else { 
                formattedPet.location = selectedPlace?.formattedAddress ?? pet.location
                formattedPet.photos = photos;
                formattedPet.services = services;

                await axios
                .patch(`${import.meta.env.VITE_BACKEND_URL}/pets/${loc.state.pet.id}`, formattedPet, {
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
    {petFromLoc ? <h1>Update Pet</h1> : <h1>Create Pet</h1>}
      <Form noValidate onSubmit={handleSubmit} id='pet-form'>
        <Row className='mb-3'>
          <Col>
            {/* Pet Name */}
            <Form.Group as={Row} className='mb-3' controlId='formBasicName'>
              <Form.Label column sm={3}>Name</Form.Label>
              <Col>
                <Form.Control
                  type='text'
                  placeholder='Enter pet name'
                  value={pet.name}
                  onChange={onChange}
                  name='name'
                  isInvalid={validated && pet.name.trim() === ''}
                  isValid={validated && pet.name.trim() !== ''}
                  required
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                <Form.Control.Feedback type='invalid'>
                  Please provide a name.
                </Form.Control.Feedback>
              </Col>
            </Form.Group>

            {/* Pet Type */}
            <Form.Group as={Row} className='mb-3' controlId='formBasicType'>
              <Form.Label column sm={3}>Type</Form.Label>
              <Col>
                <Form.Control as='select'
                  aria-label='pet type selector'
                  value={pet.type ??  ''}
                  onChange={onChange}
                  name='type'
                  isInvalid={validated && !validTypes.includes(pet.type)}
                  isValid={validated && (validTypes.includes(pet.type))}
                  required
                >
                  <option>Please select a type</option>
                  <option value='Cat'>Cat</option>
                  <option value='Dog'>Dog</option>
                  <option value='Bird'>Bird</option>
                  <option value='Other'>Other</option>
                </Form.Control>
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                <Form.Control.Feedback type='invalid'>
                  Please provide a pet type.
                </Form.Control.Feedback>
              </Col>
            </Form.Group>

            {/* Description */}
            <Form.Group as={Row} className='mb-3' controlId='formBasicDesc'>
              <Form.Label column sm={3}>Description</Form.Label>
              <Col>
                <Form.Control
                  as='textarea'
                  placeholder='Enter a description of the pet'
                  value={pet.description}
                  onChange={onChange}
                  name='description'
                  isInvalid={validated && pet.description.trim() === ''}
                  isValid={validated && pet.description.trim() !== ''}
                  required
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                <Form.Control.Feedback type='invalid'>
                  Please provide a description.
                </Form.Control.Feedback>
              </Col>
            </Form.Group>

          {/* MultiInput for Photo URLs */}
          <Form.Group className='mb-3' controlId='formBasicPhotoLinks'>
            <MultiInput label='Photos' onChange={setPhotos} preSet={pet.photos  ?? []}/>
            {validated && photos.length === 0 && (
                <div className='invalid-feedback d-block'>Please add at least one photo link</div>
            )}
            {validated && photos.length > 0 && (
                <div className='valid-feedback d-block'>Looks good!</div>
            )}
          </Form.Group>

          {/* MultiInput for Services */}
          <Form.Group className='mb-3' controlId='formBasicServices'>
            <MultiInput label='Services' onChange={setServices} preSet={pet.services ?? []}/>
            {validated && services.length === 0 && (
                <div className='invalid-feedback d-block'>Please add at least one service</div>
            )}
            {validated && services.length > 0 && (
                <div className='valid-feedback d-block'>Looks good!</div>
            )}
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