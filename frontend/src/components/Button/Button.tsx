import React from 'react'
import './styles.css'

function Button(props: {text: string}) {
  return (
    <>
      <button 
        id="simple-button"
        type="button" 
      >
        {props.text}
      </button>
    </>
  )
}

export default Button