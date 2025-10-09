import React, { useState, useEffect, ChangeEvent } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import MultiStringInput from '../MultiStringInput/MultiStringInput';
import axios from 'axios';
type Props = {}

export default function PetForm({}: Props) {

    const [services, setServices] = useState<string[]>([]);

    const [validated, setValidated] = useState<boolean>(false);

    const [pet, setPet] = useState({
        name: '',
        type: '',
        description: '',
        services: services,
        photos: [],
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
        console.log(services);
        if (form.checkValidity() === false || services.length === 0) {
            e.stopPropagation();
        }
        setValidated(true);
        console.log('something going on here');
        // await axios
        // .post(`${import.meta.env.VITE_BACKEND_URL}/pets/`, pet)
        // .then((res) => {
        //     console.log(res);
        // })
        // .catch((err) => {
        //     console.error(err);

        // })
    }

  return (
    <>
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
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
            <Form.Control type="text" placeholder="Enter a description of the pet" value={pet.description} onChange={onChange} name="description" required/>
            <Form.Control.Feedback>Loogs good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">Please provide a description</Form.Control.Feedback>
        </Form.Group>

        <MultiStringInput label="Services" onChange={setServices} />

        {/* <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Check me out" />
        </Form.Group> */}
        <Button variant="primary" type="submit">
            Submit
        </Button>
    </Form>
    </>
  )
}