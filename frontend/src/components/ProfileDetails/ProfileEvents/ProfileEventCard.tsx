import React from "react";
import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface Event {
  id: string;
  name: string;
  description: string;
  photos?: string;
  location?: string;
  approved?: boolean;
}

const ProfileEventCard: React.FC<{ event: Event }> = ({ event }) => {
  const navigate = useNavigate();

  return (
    <div className="profile-event-card">
      <Card className="card-root">
        {event.photos && (
          <CardMedia
            className="card-media"
            image={Array.isArray(event.photos) ? event.photos[0] : event.photos}
            title={event.name}
          />
        )}
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {event.name}
          </Typography>
          {event.location && (
            <Typography variant="body2" sx={{ color: "text.primary" }}>
              {event.location}
            </Typography>
          )}
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {event.description}
          </Typography>
        </CardContent>
        <CardActions className="card-actions">
          <Button size="small" onClick={() => navigate(`/events/${event.id}`)}>
            View Details
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default ProfileEventCard;