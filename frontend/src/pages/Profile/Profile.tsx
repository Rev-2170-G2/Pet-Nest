import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Offers from "../../components/Offers/Offers";
import { useAuth } from "../../context/AuthContext";
import "./Profile.css";

interface Pet {
  petId: string;
  name: string;
  description: string;
  photos?: string[];
  location?: string;
}

interface Event {
  eventId: string;
  title: string;
  description: string;
  photos?: string;
  location?: string;
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id.split("#")[1];
  const [selectedTab, setSelectedTab] = useState("offers");
  const [pets, setPets] = useState<Pet[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.token || !userId) return;

    const fetchPets = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:3000/api/pets/user/${userId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setPets(res.data.data || res.data);
      } catch (err) {
        console.error("Error fetching pets:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:3000/api/events/user/${userId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setEvents(res.data.data || res.data);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    if (selectedTab === "pets") fetchPets();
    if (selectedTab === "events") fetchEvents();
  }, [selectedTab, user?.token, userId]);

  return (
    <div className="profile-container">
      <h1 className="text-center mb-4">Your Profile</h1>

      {/* Dropdown Tabs */}
      <div className="dropdown mb-4 text-center">
        <button
          className="btn btn-primary dropdown-toggle"
          type="button"
          id="profileDropdown"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {selectedTab === "pets"
            ? "My Pets"
            : selectedTab === "events"
            ? "My Events"
            : "My Offers"}
        </button>
        <ul className="dropdown-menu" aria-labelledby="profileDropdown">
          <li>
            <button className="dropdown-item" onClick={() => setSelectedTab("pets")}>
              My Pets
            </button>
          </li>
          <li>
            <button className="dropdown-item" onClick={() => setSelectedTab("events")}>
              My Events
            </button>
          </li>
          <li>
            <button className="dropdown-item" onClick={() => setSelectedTab("offers")}>
              My Offers
            </button>
          </li>
        </ul>
      </div>

      {loading && <p className="text-center">Loading...</p>}

      <div className="profile-content">

        {/* PETS */}
        {selectedTab === "pets" && (
          <div className="profile-section">
            <div className="profile-actions text-center mb-3">
              <button className="btn btn-success me-2" onClick={() => navigate("/pet-form")}>
                Add Pet
              </button>
            </div>

            <h3 className="text-center mb-3">My Pets</h3>
            {pets.length === 0 ? (
              <p className="text-center">You haven't added any pets yet.</p>
            ) : (
              <div className="profile-pet-container">
                {pets.map((pet) => (
                  <div
                    key={pet.petId}
                    className="profile-pet-card"
                    onClick={() => navigate(`/pets/${pet.petId}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <div
                      className="profile-card-media"
                      style={{
                        backgroundImage: `url(${Array.isArray(pet.photos) ? pet.photos[0] : pet.photos})`,
                      }}
                    />
                    <div className="profile-card-content">
                      <h4>{pet.name}</h4>
                      {pet.location && <p>Location: {pet.location}</p>}
                      <p>{pet.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* EVENTS */}
        {selectedTab === "events" && (
          <div className="profile-section">
            <div className="profile-actions text-center mb-3">
              <button className="btn btn-success me-2" onClick={() => navigate("/event-form")}>
                Create Event
              </button>
            </div>

            <h3 className="text-center mb-3">My Events</h3>
            {events.length === 0 ? (
              <p className="text-center">You haven't created any events yet.</p>
            ) : (
              <div className="profile-event-container">
                {events.map((event) => (
                  <div
                    key={event.eventId}
                    className="profile-event-card"
                    onClick={() => navigate(`/events/${event.eventId}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="profile-card-content">
                      <h4>{event.title}</h4>
                      {event.location && <p>Location: {event.location}</p>}
                      <p>{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* OFFERS */}
        {selectedTab === "offers" && (
          <div className="profile-section">
            <h3 className="text-center mb-3">My Offers</h3>
            <Offers />
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;