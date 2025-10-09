import React from 'react'
import './styles.css'

interface ButtonProps {
  text: string
  onClick: (buttonText: string) => void
}

function Button(props: ButtonProps) {
  return (
    <>
      <button 
        id="simple-button"
        type="button" 
        onClick={() => props.onClick(props.text)}
      >
        {props.text}
      </button>
    </>
  )
}

export default Button