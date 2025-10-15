import React from "react";
import { useNavigate } from "react-router-dom";
import JoinCard from "./JoinCard";
import "./JoinSection.css";

function JoinSection() {
    const navigate = useNavigate();

    return (
        <div className="join-section">
            <h1 className="text-center mb-4">Got a talented pet or an event?</h1>
            <p className="text-center mb-5">Simple To Join, Choose One!</p>

            <div className="join-cards-wrapper">
                <JoinCard
                    title="Post A Pet"
                    subtitle="Is your pet talented? Join now!"
                    imageUrl="https://images.unsplash.com/photo-1581753418434-51c11169a3c1"
                    onClick={() => navigate("/pet-form")}
                />
                <JoinCard
                    title="Create An Event"
                    subtitle="Need pets for your event? We got you!"
                    imageUrl="https://images.unsplash.com/photo-1631857455684-a54a2f03665f"
                    onClick={() => navigate("/event-form")}
                />
            </div>
        </div>
    );
}

export default JoinSection;