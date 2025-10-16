import { Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import CardMedia from '@mui/material/CardMedia';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Event } from "../../types/Event";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function EventCard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const URL = "http://localhost:3000"

useEffect(() => {
  axios
    .get(`${URL}/api/events`)
    .then((res) =>
      setEvents(
        (res.data?.data || []).filter((event: Event) => event.approved === null)
      )
    )
    .catch((err) => console.error("Unable to fetch events:", err))
    .finally(() => setLoading(false));
}, []);

const handleApprove = (id: string) =>
  axios.patch(`${URL}/api/events/admin/${id}`,
    { approved: true },
    { headers: { Authorization: `Bearer ${user?.token}` } }
  )
  .then(() => setEvents(prev => prev.filter(e => e.id !== id))) //update UI
  .catch(err => console.error("Unable to approve event:", err))

const handleDeny = (id: string) =>
  axios.patch(`${URL}/api/events/admin/${id}`,
    { approved: false },
    { headers: { Authorization: `Bearer ${user?.token}` } }
  )
  .then(() => setEvents(prev => prev.filter(e => e.id !== id))) //update UI
  .catch(err => console.error("Unable to deny event:", err))

  if (loading) return <p>Loading...</p>;

return (
  <div className="eventcard-container d-flex flex-column">

    <Typography variant="h5" component="h1" className="mb-5">
      {events.length > 0
        ? "Events awaiting approval"
        : "No events awaiting approval"}
    </Typography>

    <div className="d-flex flex-row flex-wrap gap-3">
      {events
        .map((event) => (
          <div key={event.id} className="event-card">
            <Card className="card-root d-flex flex-column h-100">
              <CardMedia
                className="card-media"
                image={event.photos}
                title={event.entity}
                sx={{ height: 140 }}
              />
              <CardContent className="flex-grow-1">
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
              <CardActions className="d-flex justify-content-between mt-auto">
                <Button size="small" color="success" onClick={() => handleApprove(event.id)}>
                  Approve
                </Button>
                <Button size="small" color="error" onClick={() => handleDeny(event.id)}>
                  Deny
                </Button>
              </CardActions>
            </Card>
          </div>
        ))}
    </div>

  </div>
);
}