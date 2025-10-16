import React, {FunctionComponent} from 'react';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { Rating } from "@mui/material";


import './pets-events-listing-details.css';
import { Event } from '../../../types/Event';

interface Props {
  details: Event;
}

const EventListingDetails: FunctionComponent<Props> = ({ details }) => {

    const {
        name,
        location,
        description,
        date,
        status,
    } = details;

    return (
        <div className="details-container container py-5 d-flex flex-column justify-content-center">
            <div className="listing-content">
                <h1 className="mb-4">{name}</h1>
                <p>{location}</p>
                <div className="details">
                    <div className="detail_item">
                        <CalendarMonthIcon fontSize="medium" className="me-1" />
                        {date}
                    </div>
                    <div className="detail_item">
                        <LocationPinIcon fontSize="medium" className="me-1" />
                        {location}
                    </div>
                    <div className="detail_item">
                        {/* <BedroomIcon /> {property_bedrooms} */}
                        <EventAvailableIcon fontSize="medium" className="me-1" />
                        {status}
                    </div>
                </div>

                <p className="description">{description}</p>

            </div>
        </div>
    );
};

export default EventListingDetails;