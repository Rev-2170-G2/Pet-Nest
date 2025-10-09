import React, { useState } from 'react'
import PetCard from './PetCard/PetCard'
import EventCard from './EventCard/EventCard'

interface CardDisplayProps {
    display : string
}

function CardDisplay(props: CardDisplayProps) {
    console.log(props.display)

  return (
    <>
        {
          props.display === "Pets Please" ? <PetCard /> : <EventCard />          
        }
    </>
  )
}

export default CardDisplay