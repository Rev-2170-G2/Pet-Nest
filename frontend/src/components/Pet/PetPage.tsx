import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import PetDetails from "./PetDetails";
import { Pet } from "../../types/Pet";
import UserPets from "./UserPets";
import Review from "../Review/Review";
import { Box, Container } from "@mui/material";
import { useAuth } from "../../context/AuthContext";

const URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
const DEFAULT_PIC_1 = `url("https://cdn.pixabay.com/photo/2017/07/22/08/49/cat-2528119_1280.jpg")`;
const DEFAULT_PIC_2 = `url("https://cdn.pixabay.com/photo/2016/02/25/15/55/leather-1222379_1280.jpg")`;

export default function PetPage() {
  const { user } = useAuth();
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

  const updatePetReview = (newReview: { rating: number; reviewText: string; createdAt: string }) => {
    console.log("new Review from updatePetREview:", newReview);
    if (!pet) return;

    setPet({
      ...pet,
      review: [...pet.review, newReview]
    });
  };

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
        {user?.id !== pet.PK ?
        <Container 
          sx={{
            width:1400,
            height: 450,
            mt: 25,
            backgroundImage: DEFAULT_PIC_1 ? DEFAULT_PIC_1 : DEFAULT_PIC_2 ,
            backgroundSize: "auto 100%",      
            backgroundPosition: "bottom right", 
            backgroundRepeat: "no-repeat",     
            border: "1px solid #6A7062",
            borderRadius: 7
          }}
        >
          <Box sx={{ mt: 5 }}>
            <Review pet={pet} onReviewSubmit={updatePetReview} />
          </Box>
        </Container>
        : null}
      </div>
    )}
  </div>
);
}