import { Button, Card, CardActions, CardContent, Typography } from '@mui/material'
import CardMedia from '@mui/material/CardMedia'
import { useEffect, useState } from 'react'
import './styles.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Event } from "../../../types/Event";
import MapPopup from '../../MapView/MapPopup/MapPopup';


function EventCard() {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const [showMap, setShowMap] = useState<boolean>(false);
    const navigate = useNavigate();

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
    <>
        <div className="d-flex flex-column">
            <div className="mb-2 mx-3">
                <button className='btn btn-info h-80 my-2' onClick={() => setShowMap(true)}>Show Map</button>
                <MapPopup
                isOpen={showMap}
                onClose={() => setShowMap(false)}
                positions={events}
                markerType='events' />
            </div>
        </div>
        <div className="eventcard-container">
        {events
            .filter(event => event.approved === true) //(PREVIOUS: .filter(event => event.status === "pending"))
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
                        <Button size="small" onClick={() => navigate(`/events/${event.id}`)}>Click here to learn more</Button>
                    </CardActions>
                </Card>
            </div>
        ))}
    </div>    
    </>
  )
}

export default EventCard;