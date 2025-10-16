import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import ProfileEventCard from "./ProfileEventCard";
import { useNavigate } from "react-router-dom";
import "./ProfileEvents.css"

interface Event {
  id: string;
  title: string;
  description: string;
}

const ProfileEvents: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id.split("#")[1];
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.token || !userId) return;

    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:3000/api/events/user/${userId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setEvents(res.data.data || res.data);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user?.token, userId]);

  return (
    <div className="profile-section">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>My Events</h3>
        <button className="btn btn-success" onClick={() => navigate("/event-form")}>
          Create Event
        </button>
      </div>
      {loading && <p>Loading...</p>}
      {events.length === 0 && !loading && <p>You haven't created any events yet.</p>}
      <div className="profile-event-container">
        {events.map((event) => (
          <ProfileEventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default ProfileEvents;
