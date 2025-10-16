import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileEventCard.css"

interface Event {
  id: string;
  title: string;
  description: string;
}

const ProfileEventCard: React.FC<{ event: Event }> = ({ event }) => {
  const navigate = useNavigate();
  return (
    <div className="profile-event-card" onClick={() => navigate(`/events/${event.id}`)}>
      <div className="profile-card-content">
        <h4>{event.title}</h4>
        <p>{event.description}</p>
      </div>
    </div>
  );
};

export default ProfileEventCard;
