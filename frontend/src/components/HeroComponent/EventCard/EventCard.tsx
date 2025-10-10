import { Button, Card, CardActions, CardContent, Typography } from '@mui/material'
import CardMedia from '@mui/material/CardMedia'
import React, { useEffect, useState } from 'react'
import './styles.css'
import axios from 'axios';

interface Events {
    entity: string;
    photos: string;
    status: string;
    name: string;
    location: string;
    description: string;
}

function EventCard() {
    const [events, setEvents] = useState<Events[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/events");
                console.log(response.data);
                setEvents(response.data.data);
            } catch (error) {
                console.log('Error fetching events: ' + error);
            } finally {
                setLoading(false);
            }
        }
        fetchEvents();    
    }, [])

    if (loading) return <p>Loading...</p>

  return (
    <div className="eventcard-container">
        {events
            .filter(event => event.status === "pending")
            .map((event, index) => (
              <div key={index} className="event-card">
                <Card className="card-root">
                    <CardMedia className="card-media"
                        image={event.photos}
                        title={event.entity}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                        {event.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.primary' }}>
                        {event.location}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {event.description}
                        </Typography>
                    </CardContent>
                    <CardActions className="card-actions">
                        <Button size="small">Click here to learn more</Button>
                    </CardActions>
                </Card>
            </div>
        ))}
    </div>
  )
}

export default EventCard;