import React from 'react'
import EventForm from '../../components/EventForm/EventForm'
import PetForm from '../../components/PetForm/PetForm'
import './Home.css';

type Props = {}

export default function Home({}: Props) {
  return (
    <>
        <div>Home</div>
        {/* <EventForm></EventForm> */}
        <div id='form-container'><PetForm></PetForm></div>
        
    </>
  )
}