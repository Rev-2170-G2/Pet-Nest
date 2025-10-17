import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Event } from "../../types/Event";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import EventOfferModal from "../Offers/Events/EventOfferModal";
import { useEffect, useState } from "react";
import axios from "axios";
import { Pet } from "../../types/Pet";
import { useAuth } from "../../context/AuthContext";
import { Alert } from "@mui/material";

const DEFAULT_IMAGE = "https://th.bing.com/th/id/OIP.5t0ye0TwtLcy8ihTtU-0fQHaDs?w=341&h=174&c=7&r=0&o=7&cb=12&pid=1.7&rm=3";

export default function EventDetails({ event }: { event: Event }) {
  const { user } = useAuth();
  const userId = user?.id?.split("#")[1];
  const [open, setOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [userPets, setUserPets] = useState<Pet[]>([]);
  const navigate = useNavigate();
  const URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchPetsByUser = async () => {
      if (!userId) return;
      try {
<<<<<<< HEAD
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/pets/user/${userId}`);
        if (response.data.data) setUserPets(response.data.data);
=======
        const response = await axios.get(
          `${URL}/api/pets/user/${userId}`
        );
        console.log(
          `From fetchPetsByUser: ${JSON.stringify(response.data.data)}`
        );
        
        if (!response.data.data){
          return null;
        } else {
          setUserPets(response.data.data);
        }
>>>>>>> main
      } catch (error) {
        console.log(`Error fetching pets: ${error}`);
      }
    };
    fetchPetsByUser();
  }, [userId]);

  return (
    <div className="container py-5 min-vh-100">
      <div className="mb-4">
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>

      <div className="mb-4 text-center">
        <img
          src={event.photos || DEFAULT_IMAGE}
          alt={event.name}
          className="img-fluid rounded"
          style={{ maxHeight: "400px", width: "100%", objectFit: "cover" }}
        />
      </div>

      <div className="text-center text-md-start">
        <h1 className="mb-4">{event.name}</h1>

        <p className="d-flex justify-content-center justify-content-md-start align-items-center gap-3">
          <span className="d-flex align-items-center">
            <CalendarMonthIcon fontSize="medium" className="me-1" />
            {event.date}
          </span>
          <span className="d-flex align-items-center">
            <LocationPinIcon fontSize="medium" className="me-1" />
            {event.location}
          </span>
        </p>

        <p className="mb-4">{event.description}</p>

        <div className="d-flex justify-content-center justify-content-md-start" style={{gap: '8px', alignItems: 'flex-start'}}>
          <button className="btn btn-success btn-lg px-4"
            onClick={() => {
              if(!user) {
                setWarningMessage("You must be logged in to join an event");
                setShowWarning(true);
                return;
              }
              else if(user?.id === event.PK) {
                setWarningMessage("You cannot join your own event");
                setShowWarning(true);
                return;
              }
              else if(userPets.length <= 0) {
                setWarningMessage("Create a pet first to join an event");
                setShowWarning(true);
                return;
              }
              else {
                handleOpen();
              }
            }}
          >
            Join Event
          </button>

          {userPets.length > 0 && 
            (<EventOfferModal event={event} userPets={userPets} open={open} handleClose={handleClose}/>)}

          {showWarning && 
            (<Alert severity="warning" sx={{ ml: 2, width: 300, borderRadius: 4 }} 
              onClose={() => setShowWarning(false)}>
                {warningMessage}
            </Alert>)}
        </div>
      </div>
    </div>
  );
}
