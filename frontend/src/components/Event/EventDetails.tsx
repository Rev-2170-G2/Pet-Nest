import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Event } from "../../types/Event";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import EventOfferModal from "../Offers/Events/EventOfferModal";
import { useState } from "react";

const DEFAULT_IMAGE = "https://th.bing.com/th/id/OIP.5t0ye0TwtLcy8ihTtU-0fQHaDs?w=341&h=174&c=7&r=0&o=7&cb=12&pid=1.7&rm=3";

export default function EventDetails({ event }: { event: Event }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();

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

        <div className="d-flex justify-content-center justify-content-md-start">
          <button className="btn btn-success btn-lg px-4" onClick={handleOpen}>
            Join Event
          </button>
          <EventOfferModal event={event} open={open} handleClose={handleClose}/>
        </div>
      </div>
    </div>
  );
}