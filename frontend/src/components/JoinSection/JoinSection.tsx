import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./JoinSection.css";

function JoinSection() {
    const navigate = useNavigate();

    return (
        <div className="join-section">
            <h1 className="text-center mb-4">Got a talented pet or an event?</h1>
            <p className="text-center mb-5">
                Simple to join!
            </p>

            <div className="join-cards-wrapper">
                <div className="join-card text-center" onClick={() => navigate("/pets")}>
                    <h5>Post A Pet</h5>
                    <p>Is your pet talented? Join now!</p>
                </div>

                <div className="join-card text-center" onClick={() => navigate("/events")}>
                    <h5>Create An Event</h5>
                    <p>Need pets for your event? We got you!</p>
                </div>
            </div>
        </div>
    );
}

export default JoinSection;