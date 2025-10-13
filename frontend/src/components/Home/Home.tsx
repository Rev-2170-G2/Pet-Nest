import HeroSection from "../HeroComponent/HeroSection/HeroSection";
import JoinSection from "../JoinSection/JoinSection";

interface HomeProps {
  joinRef: React.RefObject<HTMLDivElement | null>;
}

function Home({ joinRef }: HomeProps) {
  return (
    <>
      <HeroSection />
      <div ref={joinRef} id="join">
        <JoinSection />
      </div>
    </>
  );
}

export default Home;