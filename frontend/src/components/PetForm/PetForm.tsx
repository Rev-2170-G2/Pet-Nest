import { useState, useEffect, ChangeEvent } from 'react';
import {  Form, Button, Container, Row, Col } from 'react-bootstrap';
import MultiStringInput from '../MultiStringInput/MultiStringInput';
import MapView from '../../components/MapView/MapView';
import axios from 'axios';
import './PetForm.css';
type Props = {}

export default function PetForm({}: Props) {

    type service = {
        service: string,
        price: number
    }
    const [services, setServices] = useState<service[]>([]);
;

    const [validated, setValidated] = useState<boolean>(false);
    
    const [pet, setPet] = useState({
        name: '',
        type: '',
        description: '',
        services: services,
        photos: {},
        location: ''
    });

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPet({ ...pet, [e.target.name]: e.target.value });
    }

    useEffect(() => {
        setPet({...pet, services: services});
    },[services])

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false || services.length === 0) {
            e.stopPropagation();
            console.log('PetForm validation failed');
        } else if (form.checkValidity() === true && services.length > 0) {
            setValidated(true);
            console.log('PetForm validation passed');
            console.log(pet);
            // await axios
            // .post(`${import.meta.env.VITE_BACKEND_URL}/pets/`, pet)
            // .then((res) => {
            //     console.log(res);
            // })
            // .catch((err) => {
            //     console.error(err);
            // })
        }
    }

  return (
    <>
    <Container>
        <Form noValidate validated={validated} onSubmit={handleSubmit} id='pet-form'>
            <Col>
                <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Label>Pet name</Form.Label>
                    <Form.Control type="text" placeholder="Enter pet name" value={pet.name} onChange={onChange} name="name" required/>
                    <Form.Control.Feedback>Loogs good!</Form.Control.Feedback>
                    <Form.Control.Feedback type="invalid">Please provide a name</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicType">
                    <Form.Label>Pet type</Form.Label>
                    <Form.Control type="text" placeholder="Enter pet type" value={pet.type} onChange={onChange} name="type" required/>
                    <Form.Control.Feedback>Loogs good!</Form.Control.Feedback>
                    <Form.Control.Feedback type="invalid">Please provide a pet type</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicDesc">
                    <Form.Label>Pet description</Form.Label>
                    <Form.Control as="textarea" placeholder="Enter a description of the pet" value={pet.description} onChange={onChange} name="description" required/>
                    <Form.Control.Feedback>Loogs good!</Form.Control.Feedback>
                    <Form.Control.Feedback type="invalid">Please provide a description</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Default file input example</Form.Label>
                    <Form.Control type="file" />
                </Form.Group>
            </Col>

            <MultiStringInput label="Services" onChange={setServices} />
            <Col>
            <MapView></MapView>
            </Col>
            
            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    </Container>
    </>
  )
}