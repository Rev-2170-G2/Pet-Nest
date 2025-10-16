import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Pet } from "../../types/Pet";

const URL = "http://localhost:3000";

interface UserPetsProps {
  userId: string;
  excludePetId?: string;
}

export default function UserEvents({ userId, excludePetId }: UserPetsProps) {
  const [pets, setPets] = useState<Pet[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`${URL}/api/pets/user/${userId}`)
      .then((res) =>
        setPets(
          (res.data?.data || []).filter((pet: Pet) => pet.id !== excludePetId)
        )
      )
      .catch((err) => console.error(err));
  }, [userId, excludePetId]);


  return (
    <div className="container mt-4">
      <h3>More pets from this owner</h3>
      <div className="row">
        {pets.map((pet) => (
          <div
            key={pet.id}
            className="col-md-4 mb-3"
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/pets/${pet.id}`)}
          >
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{pet.name}</h5>
                <p className="card-text">{pet.description}</p>
                <p className="card-text">{pet.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}