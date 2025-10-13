import React from 'react'
import EventForm from '../../components/EventForm/EventForm'
import HeroSection from '../../components/HeroComponent/HeroSection/HeroSection';
import PetForm from '../../components/PetForm/PetForm'
import './Home.css';

type Props = {}

export default function Home({}: Props) {
  return (
    <>
      <HeroSection />
      {/* <PetForm />
      <EventForm /> */}
    </>
  )
}