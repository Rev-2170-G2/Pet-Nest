import {FunctionComponent} from 'react';
import { useNavigate } from 'react-router-dom';
import PetsIcon from '@mui/icons-material/Pets';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { Rating } from "@mui/material";


import './pets-events-listing-details.css';
import { Pet } from '../../../types/Pet';

interface Props {
  details: Pet;
}

const PetListingDetails: FunctionComponent<Props> = ({ details }) => {

    const {
        name,
        location,
        eventsCompleted,
        type,
        review,
        description,
        services,
        id
    } = details;

    const navigate = useNavigate();

    const averageRating = review && review.length > 0
      ? review.reduce((sum, r) => sum + r.rating, 0) / review.length
      : 0;

    return (
        <div className="details-container container py-3 d-flex flex-column justify-content-center border border-secondary rounded overflow-auto">
            <div className="listing-content">
                <h2>{name}</h2>
                <p className="description">{description}</p>
                <div className="details">
                    <div className="detail_item">
                        <PetsIcon fontSize="small" />
                        {type}
                    </div>
                    <div className="detail_item">
                        <LocationPinIcon fontSize="small" />
                        {location || "Unknown"}
                    </div>
                    <div className="detail_item">
                        {/* <BedroomIcon /> {property_bedrooms} */}
                        <EventAvailableIcon fontSize="small" />
                        {eventsCompleted || 0}
                    </div>
                    <div className="detail_item">
                        <Rating name="pet-rating" value={averageRating || 0} readOnly />
                    </div>
                </div>

                {/* <p className="price">{getFormattedCurrency(property_price)}</p> */}
                <h4 className="mb-3">Services Offered</h4>
                <ul className="list-group mb-4">
                    {services?.map((service, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                        {service.service}
                        <span className="badge bg-primary rounded-pill">${service.price}</span>
                    </li>
                    ))}
                </ul>
            </div>
            <button className="btn btn-secondary mx-auto" onClick={(() => navigate(`/pets/${id}`))}>More Info</button>
        </div>
    );
};

export default PetListingDetails;