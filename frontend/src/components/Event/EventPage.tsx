import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import EventDetails from "./EventDetails";
import UserEvents from "./UserEvents";
import { Event } from "../../types/Event";

<<<<<<< HEAD
=======
const URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

>>>>>>> main
export default function EventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/events/${id}`)
      .then((res) => setEvent(res.data?.data?.[0] || null))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

 return (
  <div className="d-flex justify-content-center align-items-center min-vh-100">
    {loading ? (
      <p>Page is loading...</p>
    ) : !event ? (
      <div className="text-center">
        <h1>Event not found</h1>
        <p>The event you're looking for does not exist.</p>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Go Home
        </button>
      </div>
    ) : (
      <div className="w-100">
        <EventDetails event={event} />
        {event?.PK && <UserEvents userId={event.PK.slice(2)} excludeEventId={event.id} />}
      </div>
    )}
  </div>
);
}