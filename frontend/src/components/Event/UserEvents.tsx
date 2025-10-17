import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Event } from "../../types/Event";

const URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

interface UserEventsProps {
  userId: string;
  excludeEventId: string;
}

export default function UserEvents({ userId, excludeEventId }: UserEventsProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const navigate = useNavigate();

useEffect(() => {
  if (!userId) return;

  axios
    .get(`${URL}/api/events/user/${userId}?status=open`)
    .then((res) => 
      setEvents(
        (res.data?.data || []).filter((event: Event) => event.id !== excludeEventId)
      )
    )
    .catch((err) => console.error(err));
}, [userId, excludeEventId]);

  return (
    <div className="container mt-4">
      <h3>More events from this organizer</h3>
      <div className="row">
        {events.map((event) => (
          <div
            key={event.id}
            className="col-md-4 mb-3"
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/events/${event.id}`)}
          >
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{event.name}</h5>
                <p className="card-text">{event.date}</p>
                <p className="card-text">{event.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}