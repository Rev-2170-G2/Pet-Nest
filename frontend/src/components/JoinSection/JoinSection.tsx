import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function JoinSection() {
    const navigate = useNavigate();

    return (
        <div className="container py-5 min-vh-100">
            <h1 className="mb-4 text-center">Got an event or a talented pet?</h1>
            <p className="text-center mb-5">
                Pick a section to join and explore exciting options.
            </p>

            <div className="d-flex justify-content-center gap-4 flex-wrap">
                <div
                    className="card text-center p-4"
                    style={{ width: "250px", cursor: "pointer" }}
                    onClick={() => navigate("/pets")}
                >
                    <h5>Post A Pet</h5>
                    <p>Is your pet talented? Join now!</p>
                </div>

                <div
                    className="card text-center p-4"
                    style={{ width: "250px", cursor: "pointer" }}
                    onClick={() => navigate("/events")}
                >
                    <h5>Create An Event</h5>
                    <p>Need pets for your event? We got you!</p>
                </div>
            </div>
        </div>
    );
}