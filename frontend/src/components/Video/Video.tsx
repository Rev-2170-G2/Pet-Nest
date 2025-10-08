import React, { useState } from 'react'
import './styles.css'

function Video() {
    const [index, setIndex] = useState(0)
    const videos = [
        "https://cdn.pixabay.com/video/2023/02/15/150872-799327599_large.mp4", 
        "https://cdn.pixabay.com/video/2022/09/04/130172-746395226_large.mp4",
        "https://cdn.pixabay.com/video/2023/02/15/150872-799327599_large.mp4", 
        "https://cdn.pixabay.com/video/2022/09/04/130172-746395226_large.mp4"
    ]

    function handleOnEnded(){
        setIndex((index) => {
            return index = index === 3 ? 0 : index + 1;
        })
    }

  return (
    <div className='video-container'>
        <video 
            key={index}
            autoPlay 
            muted
            playsInline 
            onEnded={handleOnEnded} 
        >
            <source src={videos[index]}  />
        </video>
    </div>
  )
}

export default Video