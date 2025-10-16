import { Pet } from "../../types/Pet";
import { Rating, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import LocationPinIcon from '@mui/icons-material/LocationPin';
import PetsIcon from '@mui/icons-material/Pets';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { useContext, useState } from "react";
import PetOfferModal from "../Offers/Pets/PetOfferModal";
import { AuthContext } from "../../context/AuthContext";

const DEFAULT_IMAGE = "https://jooinn.com/images/pet-70.jpg";

export default function PetDetails({ pet }: { pet: Pet }) {
    const { user } = useContext(AuthContext);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const navigate = useNavigate();
    const [showWarning, setShowWarning] = useState(false);
    const [warningMessage, setWarningMessage] = useState("");

  return (
    <div className="container py-5 d-flex flex-column justify-content-center">
      <div className="row g-4 align-items-start">
        <div className="col-12 col-md-5 d-flex justify-content-center align-items-start">
          <div className="w-100" style={{ maxWidth: "700px", height: "400px" }}>
            <img
              src={Array.isArray(pet.photos) ? pet.photos?.[0] || DEFAULT_IMAGE : pet.photos}
              alt={pet.name}
              className="img-fluid rounded"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>

        <div className="col-12 col-md-7 d-flex flex-column">
          <div className="mb-3">
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>
              ← Back
            </button>
          </div>

          <h1 className="mb-2">{pet.name}</h1>

          <div className="d-flex flex-wrap mb-3 gap-3 align-items-center">
            <span className="d-flex align-items-center gap-1">
              <PetsIcon fontSize="small" />
              {pet.type}
            </span>
            <span className="d-flex align-items-center gap-1">
              <LocationPinIcon fontSize="small" />
              {pet.location || "Unknown"}
            </span>
            <span className="d-flex align-items-center gap-1">
              <EventAvailableIcon fontSize="small" />
              {pet.eventsCompleted || 0} events completed
            </span>
          </div>

          <div className="d-flex align-items-center mb-3">
            <Rating name="pet-rating" value={pet.review || 0} readOnly />
            <span className="ms-2 text-muted">({pet.review || 0})</span>
          </div>

          <p className="mb-4">{pet.description}</p>

          <h4 className="mb-3">Services Offered</h4>
          <ul className="list-group mb-4">
            {pet.services?.map((service, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                {service.service}
                <span className="badge bg-primary rounded-pill">${service.price}</span>
              </li>
            ))}
          </ul>

          <div className="d-flex flex-column" style={{ gap: '8px' }}>
            <button className="btn btn-success btn-lg px-4"
              onClick={() => {
                if(!user) {
                  setWarningMessage("You must be logged in to request a service");
                  setShowWarning(true);
                  return;
                }
                else if(user?.id === pet.PK) {
                  setWarningMessage("You cannot request your own service");
                  setShowWarning(true);
                  return;
                }
                else{
                  handleOpen();
                }
              }}
            >
              Request Service
            </button>
            <PetOfferModal pet={pet} open={open} handleClose={handleClose}/>

            {showWarning && 
              (<Alert severity="warning" sx={{ ml: 2, width: 300, borderRadius: 4 }} onClose={() => setShowWarning(false)}>{warningMessage}</Alert>)}
          </div>
        </div>
      </div>
    </div>
  );
}