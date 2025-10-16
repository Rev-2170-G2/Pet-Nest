import EventForm from '../../components/EventForm/EventForm'
import HeroSection from '../../components/HeroComponent/HeroSection/HeroSection';
import PetForm from '../../components/PetForm/PetForm'
import JoinSection from "../../components/JoinSection/JoinSection";
import './Home.css';

interface HomeProps {
  joinRef: React.RefObject<HTMLDivElement | null>;
}

export default function Home({ joinRef }: HomeProps) {
  return (
    <>
      <HeroSection />
      <div ref={joinRef} id="join">
        <JoinSection />
      </div>
      {/* <PetForm />
      <EventForm /> */}
    </>
  )
}