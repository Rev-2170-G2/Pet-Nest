import React, { useState } from "react";
import ProfilePets from "../../components/ProfileDetails/ProfilePets/ProfilePets";
import ProfileEvents from "../../components/ProfileDetails/ProfileEvents/ProfileEvents";
import ProfileOffers from "../../components/ProfileDetails/ProfileOffers/ProfileOffers";
import "./Profile.css";

const Profile: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("offers");

  return (
    <div className="profile-container">
      <h1 className="text-center mb-4">Your Profile</h1>

      <div className="dropdown mb-4 text-center">
        <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
          {selectedTab === "pets" ? "My Pets" : selectedTab === "events" ? "My Events" : "My Offers"}
        </button>
        <ul className="dropdown-menu">
          <li><button className="dropdown-item" onClick={() => setSelectedTab("pets")}>My Pets</button></li>
          <li><button className="dropdown-item" onClick={() => setSelectedTab("events")}>My Events</button></li>
          <li><button className="dropdown-item" onClick={() => setSelectedTab("offers")}>My Offers</button></li>
        </ul>
      </div>

      <div className="profile-content">
        {selectedTab === "pets" && <ProfilePets />}
        {selectedTab === "events" && <ProfileEvents />}
        {selectedTab === "offers" && <ProfileOffers />}
      </div>
    </div>
  );
};

export default Profile;
