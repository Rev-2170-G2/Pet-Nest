import { useState } from 'react';
import Video from '../Video/Video';
import Button from '../Button/Button';
import './styles.css';
import CardDisplay from '../CardDisplay/CardDisplay';

const buttonNames: string[] = ["Pets Please", "Event Hunting"];

function HeroSection() {
    const [selectedButton, setSelectedButton] = useState<string>("Pets Please");

    function handleButtonClick(buttonText: string){
      setSelectedButton(buttonText);
    }

  return (
    <>
      <div className="hero-container">
        <Video />
        <div className="hero-buttons">
          {buttonNames.map((name, index) => (
            <Button
              key={index}
              text={name}
              onClick={handleButtonClick}
            />
          ))}
        </div>
      </div>
      <CardDisplay display={selectedButton} />
    </>
  )
}

export default HeroSection;