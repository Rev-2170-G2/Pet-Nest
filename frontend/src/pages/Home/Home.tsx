import React from 'react'
import EventForm from '../../components/EventForm/EventForm'
import PetForm from '../../components/PetForm/PetForm'

type Props = {}

export default function Home({}: Props) {
  return (
    <>
        <div>Home</div>
        {/* <EventForm></EventForm> */}
        <PetForm></PetForm>
    </>
  )
}