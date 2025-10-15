import { useState, useEffect, useContext } from 'react';
import {  Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
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
  location: google.maps.places.Place | null;
}

export default function PetForm() {
    const navigate = useNavigate();
    const validTypes: string[] = ['cat', 'dog', 'bird', 'other'];

    const [services, setServices] = useState<Service[]>([]);
    const [selectedPlace, setSelectedPlace] = useState<google.maps.places.Place | null>(null);
    const [validated, setValidated] = useState<boolean>(false);
    const [photos, setPhotos] = useState<string[]>([]);
    
    const [pet, setPet] = useState<Pet>({
        name: '',
        type: '',
        description: '',
        services: services,
        photos: photos,
        location: selectedPlace
    });
    const { user } = useContext(AuthContext);
    

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setPet({ ...pet, [e.target.name as keyof Pet]: e.target.value });
    };

    // sync services and location and photos into pet object
    useEffect(() => {
        setPet({...pet, services});
    },[services]);

    useEffect(() => {
    if(selectedPlace && selectedPlace.location) {
        setPet({ ...pet, location: selectedPlace});
      }
    }, [selectedPlace]);

    useEffect(() => {
      if(photos.length > 0) {
        setPet({...pet, photos});
      }
    }, [photos]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        e.preventDefault();
        const isFormValid = 
          pet.name.trim() !== '' &&
          validTypes.includes(pet.type) &&
          pet.description.trim() !== '' &&
          services.length > 0 &&
          photos.length > 0 &&
          pet.location;
        console.log(pet);
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
            const formattedPet = {
              ...pet, location: selectedPlace?.formattedAddress
            };
            await axios
            .post(`${import.meta.env.VITE_BACKEND_URL}/pets/`, formattedPet, {
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

  return (
    <>
   <Container>
    <h1>Create Pet</h1>
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
                <Form.Select
                  aria-label='pet type selector'
                  onChange={onChange}
                  name='type'
                  isInvalid={validated && !validTypes.includes(pet.type)}
                  isValid={validated && validTypes.includes(pet.type)}
                  required
                >
                  <option>Please select a type</option>
                  <option value='cat'>Cat</option>
                  <option value='dog'>Dog</option>
                  <option value='bird'>Bird</option>
                  <option value='other'>Other</option>
                </Form.Select>
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

          {/* MultiStringInput for Photo URLs */}
          <Form.Group className='mb-3' controlId='formBasicPhotoLinks'>
            <MultiInput label='Photos' onChange={setPhotos} />
            {validated && photos.length === 0 && (
                <div className='invalid-feedback d-block'>Please add at least one photo link</div>
            )}
            {validated && photos.length > 0 && (
                <div className='valid-feedback d-block'>Looks good!</div>
            )}
          </Form.Group>

          {/* MultiStringInput for Services */}
          <Form.Group className='mb-3' controlId='formBasicServices'>
            <MultiInput label='Services' onChange={setServices} />
            {validated && services.length === 0 && (
                <div className='invalid-feedback d-block'>Please add at least one service</div>
            )}
            {validated && services.length > 0 && (
                <div className='valid-feedback d-block'>Looks good!</div>
            )}
          </Form.Group>
          </Col>

          {/* Map Column */}
          <Col>
            <Form.Group className='mb-3' controlId='formMap'>
              <MapView setSelectedPlace={setSelectedPlace} selectedPlace={selectedPlace} width={'50vw'} height={'45vh'}/>
              {validated && !selectedPlace && (
                <div className='invalid-feedback d-block'>Please choose a location by searching</div>
              )}
              {validated && selectedPlace && (
                <div className='valid-feedback d-block'>Looks good!</div>
            )}
            </Form.Group>
          </Col>
        </Row>
        
        {/* Confirmation Checkbox */}
        {/* <Form.Group className='mb-3' controlId='formBasicCheckbox'>
          <Form.Check type='checkbox' label='Confirm settings' isValid={validated} isInvalid ={validated} required />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          <Form.Control.Feedback type='invalid'>
            Please confirm information is correct.
          </Form.Control.Feedback>
        </Form.Group> */}
        <Button variant='primary' type='submit'>
          Submit
        </Button>
      </Form>
    </Container>
    </>
  )
}