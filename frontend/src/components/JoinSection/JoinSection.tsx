import { useState } from "react";
import { useNavigate } from "react-router-dom";
import JoinCard from "./JoinCard";
import Login from "../Auth/Login/Login";
import "./JoinSection.css";
import { useAuth } from "../../context/AuthContext";

function JoinSection() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [showLogin, setShowLogin] = useState(false);
    const [redirectPath, setRedirectPath] = useState("");
    const [loginMessage, setLoginMessage] = useState("");

    const handleJoinClick = (path: string) => {
        if (!user) {
            setRedirectPath(path);
            setLoginMessage("You must be logged in to perform this action.");
            setShowLogin(true);
        } else {
            navigate(path);
        }
    };

    return (
        <div className="join-section">
            <h1 className="text-center mb-4">Got a talented pet or an event?</h1>
            <p className="text-center mb-5">Simple To Join, Choose One!</p>

            <div className="join-cards-wrapper">
                <JoinCard
                    title="Post A Pet"
                    subtitle="Is your pet talented? Join now!"
                    imageUrl="https://images.unsplash.com/photo-1581753418434-51c11169a3c1"
                    onClick={() => handleJoinClick("/pet-form")}
                />
                <JoinCard
                    title="Create An Event"
                    subtitle="Need pets for your event? We got you!"
                    imageUrl="https://images.unsplash.com/photo-1631857455684-a54a2f03665f"
                    onClick={() => handleJoinClick("/event-form")}
                />
            </div>

            {showLogin && (
                <Login
                    onClose={() => setShowLogin(false)}
                    message={loginMessage}
                    redirectTo={redirectPath}
                />
            )}
        </div>
    );
}

export default JoinSection;