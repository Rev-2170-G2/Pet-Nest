import React, { useState } from 'react'
import Video from '../Video/Video'
import Button from '../Button/Button'
import './styles.css'
import CardDisplay from '../CardDisplay'

function HeroSection() {
    const [selectedButton, setSelectedButton] = useState("Pets Please")

    function handleButtonClick(buttonText: string){
      setSelectedButton(buttonText)
    }
  return (
    <>
      <div className="hero-container">
        <Video />
        <div className="hero-buttons">
          <Button 
            text="Pets Please" 
            onClick={handleButtonClick}
          />
          <Button 
            text="Event Hunting" 
            onClick={handleButtonClick}
          />
        </div>
      </div>
      <CardDisplay display={selectedButton} />
    </>
  )
}

export default HeroSection