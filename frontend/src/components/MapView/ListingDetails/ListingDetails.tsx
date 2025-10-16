import React, {FunctionComponent} from 'react';

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
        services
    } = details;

    return (
        <div className="details-container">
            <div className="listing-content">
                <h2>{name}</h2>
                <p>{location}</p>
                <div className="details">
                    <div className="detail_item">
                        {/* <FloorplanIcon /> {property_square_feet.replace('sq ft', 'ft²')} */}
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
                        <Rating name="pet-rating" value={review || 0} readOnly />
                    </div>
                </div>

                <p className="description">{description}</p>

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
        </div>
    );
};

export default PetListingDetails;