import { Button, Card, CardActions, CardContent, Typography } from '@mui/material'
import CardMedia from '@mui/material/CardMedia'
import React from 'react'
import './styles.css'

const cards = Array(4).fill(1);

function EventCard() {
  return (
    <div className="eventcard-container">
        {cards.map((_,index) => (
            <div key={index}>
                <Card sx={{ maxWidth: 250 }}>
                    <CardMedia
                        sx={{ height: 140 }}
                        image="https://cdn.pixabay.com/photo/2017/04/07/12/38/camera-2210891_1280.jpg"
                        title="animal movie"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                        Homeward Bound VIII Casting Call
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Got talents pets? Looking for a variety animals to star and be extras for upcoming shoot of Homeward Bound VIII. No previous experience required.
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small">Click here to learn more</Button>
                    </CardActions>
                </Card>
            </div>
        ))}
    </div>
  )
}

export default EventCard