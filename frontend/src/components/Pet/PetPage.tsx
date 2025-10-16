import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import PetDetails from "./PetDetails";
import { Pet } from "../../types/Pet";
import UserPets from "./UserPets";

const URL = "http://localhost:3000";

export default function PetPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    axios
      .get(`${URL}/api/pets/${id}`)
      .then((res) => setPet(res.data?.data?.[0] || null))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

return (
  <div className="d-flex justify-content-center align-items-center min-vh-100 ">
    {loading ? (
      <p>Page is loading...</p>
    ) : !pet ? (
      <div className="text-center">
        <h1>Pet not found</h1>
        <p>The pet you're looking for does not exist.</p>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Go Home
        </button>
      </div>
    ) : (
      <div className="d-flex flex-column">
        <PetDetails pet={pet} />
        {pet?.PK && <UserPets userId={pet.PK.slice(2)} excludePetId={pet.id} />}
      </div>
    )}
  </div>
);
}