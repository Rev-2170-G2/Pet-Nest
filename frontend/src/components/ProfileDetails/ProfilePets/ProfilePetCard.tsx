import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProfilePetCard.css"

interface Pet {
  id: string;
  name: string;
  description: string;
  photos?: string[];
  location?: string;
}

const ProfilePetCard: React.FC<{ pet: Pet }> = ({ pet }) => {
  const navigate = useNavigate();
  return (
    <div className="profile-pet-card" onClick={() => navigate(`/pets/${pet.id}`)}>
      {pet.photos && pet.photos[0] && (
        <div
          className="profile-card-media"
          style={{ backgroundImage: `url(${Array.isArray(pet.photos) ? pet.photos[0] : pet.photos})` }}
        />
      )}
      <div className="profile-card-content">
        <h4>{pet.name}</h4>
        {pet.location && <p>Location: {pet.location}</p>}
        <p>{pet.description}</p>
      </div>
    </div>
  );
};

export default ProfilePetCard;
