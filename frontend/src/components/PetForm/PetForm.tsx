import { useState, useEffect, ChangeEvent } from 'react';
import {  Form, Button, Container, Row, Col } from 'react-bootstrap';
import MultiStringInput from '../MultiInputs/MultiInputs';
import MapView from '../../components/MapView/MapView';
import axios from 'axios';
import './PetForm.css';
type Props = {}

export type Service = {
    service: string,
    price: number
}

export default function PetForm({}: Props) {
    const [services, setServices] = useState<Service[]>([]);
    const [selectedPlace, setSelectedPlace] = useState<google.maps.places.Place | null>(null);
    const [validated, setValidated] = useState<boolean>(false);
    const [photos, setPhotos] = useState<string[]>([]);
    
    const [pet, setPet] = useState({
        name: '',
        type: '',
        description: '',
        services: services,
        photos: photos,
        location: selectedPlace
    });

    const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPet({ ...pet, [e.target.name]: e.target.value });
    };

    // sync services and location and photos into pet object
    useEffect(() => {
        setPet({...pet, services: services});
    },[services]);
    useEffect(() => {
      if(selectedPlace && selectedPlace.location) {
          setPet({ ...pet, location: selectedPlace});
      }
    }, [selectedPlace, setSelectedPlace]);
    useEffect(() => {
      if(photos && photos.length > 0) {
        setPet({...pet, photos: photos});
      }
    }, [photos]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const form = e.currentTarget;
        // change validated attribute before checking validity to ensure react processes a change in the virtual DOM
        setValidated(true); 

        if (form.checkValidity() === false || services.length === 0) {
            e.stopPropagation();
            console.log('PetForm validation failed');
            return;
        } else if (form.checkValidity() === true && services.length > 0) {
            setValidated(true);
            console.log('PetForm validation passed');
            console.log(pet);
        // try {
        // const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/pets/`, pet);
        // console.log(res);
        // } catch (err) {
        // console.error(err);
        // }
        }
    }

  return (
    <>
   <Container>
      <Form noValidate onSubmit={handleSubmit} id="pet-form">
        <Row className="mb-3">
          <Col>
            {/* Pet Name */}
            <Form.Group as={Row} className="mb-3" controlId="formBasicName">
              <Form.Label column sm={3}>Name</Form.Label>
              <Col>
                <Form.Control
                  type="text"
                  placeholder="Enter pet name"
                  value={pet.name}
                  onChange={onChange}
                  name="name"
                  isInvalid={validated}
                  required
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                <Form.Control.Feedback type="invalid">
                  Please provide a name.
                </Form.Control.Feedback>
              </Col>
            </Form.Group>

            {/* Pet Type */}
            <Form.Group as={Row} className="mb-3" controlId="formBasicType">
              <Form.Label column sm={3}>Type</Form.Label>
              <Col>
                <Form.Control
                  type="text"
                  placeholder="Enter pet type"
                  value={pet.type}
                  onChange={onChange}
                  name="type"
                  isInvalid={validated}
                  required
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                <Form.Control.Feedback type="invalid">
                  Please provide a pet type.
                </Form.Control.Feedback>
              </Col>
            </Form.Group>

            {/* Description */}
            <Form.Group as={Row} className="mb-3" controlId="formBasicDesc">
              <Form.Label column sm={3}>Description</Form.Label>
              <Col>
                <Form.Control
                  as="textarea"
                  placeholder="Enter a description of the pet"
                  value={pet.description}
                  onChange={onChange}
                  name="description"
                  isInvalid={validated}
                  required
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                <Form.Control.Feedback type="invalid">
                  Please provide a description.
                </Form.Control.Feedback>
              </Col>
            </Form.Group>

          {/* MultiStringInput for Photo URLs */}
          <Form.Group as={Row} className="mb-3" controlId="formBasicPhotoLinks">
            <MultiStringInput label="Photos" onChange={setPhotos} />
            {validated && services.length === 0 && (
                <div className="invalid-feedback d-block">Please add at least one photo link</div>
            )}
            {validated && services.length > 0 && (
                <div className="valid-feedback d-block">Looks good!</div>
            )}
          </Form.Group>

            {/* Confirmation Checkbox */}
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check type="checkbox" label="Confirm settings" isInvalid={validated} required />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">
                Please confirm information is correct.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          {/* Map Column */}
          <Col>
            <MapView setSelectedPlace={setSelectedPlace} selectedPlace={selectedPlace} />
          </Col>

          {/* MultiStringInput for Services */}
          <Form.Group as={Row} className="mb-3" controlId="formBasicServices">
            <MultiStringInput label="Services" onChange={setServices} />
            {validated && services.length === 0 && (
                <div className="invalid-feedback d-block">Please add at least one service</div>
            )}
            {validated && services.length > 0 && (
                <div className="valid-feedback d-block">Looks good!</div>
            )}
          </Form.Group>
        </Row>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
    </>
  )
}