import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ProfileCard from "../ProfileCard/ProfileCard";
import "../ProfileCard/ProfileCard.css";

interface Pet {
  id: string;
  name: string;
  description: string;
  photos?: string[];
  location?: string;
}

const ProfilePets: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id.split("#")[1];
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.token || !userId) return;

    const fetchPets = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/pets/user/${userId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setPets(res.data.data || res.data);
      } catch (err) {
        console.error("Error fetching pets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [user?.token, userId]);

  const handleDelete = (deletedId: string) => {
    setPets(pets.filter((p) => p.id !== deletedId));
  };

  return (
    <div className="profile-section">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>My Pets</h3>
        <button className="btn btn-success" onClick={() => navigate("/pet-form")}>
          Add Pet
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {pets.length === 0 && !loading && <p>You haven't added any pets yet.</p>}

      <div className="petcard-container">
        {pets.map((pet) => (
          <ProfileCard
            key={pet.id}
            id={pet.id}
            title={pet.name}
            description={pet.description}
            imageUrl={pet.photos?.[0]}
            locationOrDate={pet.location}
            viewLink={`/pets/${pet.id}`}
            onDeleteUrl={`${import.meta.env.VITE_BACKEND_URL}/pets`}
            token={user?.token}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default ProfilePets;