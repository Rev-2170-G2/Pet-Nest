import React from "react";
import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface Pet {
  id: string;
  name: string;
  description: string;
  photos?: string[];
  location?: string;
}

const ProfilePetCard: React.FC<{ pet: Pet }> = ({ pet }) => {
  const navigate = useNavigate();

  const imageSrc = Array.isArray(pet.photos) && pet.photos.length > 0 ? pet.photos[0] : undefined;

  return (
    <div className="profile-pet-card">
      <Card className="card-root">
        {imageSrc && (
          <CardMedia
            className="card-media"
            image={imageSrc}
            title={pet.name}
          />
        )}
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {pet.name}
          </Typography>
          {pet.location && (
            <Typography variant="body2" sx={{ color: "text.primary" }}>
              {pet.location}
            </Typography>
          )}
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {pet.description}
          </Typography>
        </CardContent>
        <CardActions className="card-actions">
          <Button size="small" onClick={() => navigate(`/pets/${pet.id}`)}>
            View Details
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default ProfilePetCard;