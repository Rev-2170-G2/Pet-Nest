import React from 'react'
import Video from '../Video/Video'
import Button from '../Button/Button'
import './styles.css'

function HeroSection() {
  return (
    <div className="hero-container">
      <Video />
      <div className="hero-buttons">
        <Button text="Pets Please"/>
        <Button text="Event Hunting"/>
      </div>
    </div>
  )
}

export default HeroSection