import {FunctionComponent} from 'react';
import { useNavigate } from 'react-router-dom';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

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
        id,
    } = details;

    const navigate = useNavigate();
    return (
        <div className="details-container container py-3 d-flex flex-column justify-content-center border border-secondary rounded overflow-auto">
            <div className="listing-content">
                <h2 className="mb-4">{name}</h2>
                <p className="description">{description}</p>
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
            </div>
            <button className="btn btn-secondary mx-auto" onClick={(() => navigate(`/events/${id}`))}>More Info</button>
        </div>
    );
};

export default EventListingDetails;