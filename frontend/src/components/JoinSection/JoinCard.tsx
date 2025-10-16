import React from "react";
import "./JoinCard.css";

interface JoinCardProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  onClick: () => void;
}

const JoinCard: React.FC<JoinCardProps> = ({ title, subtitle, imageUrl, onClick }) => {
  return (
    <div className="join-card" style={{ backgroundImage: `url(${imageUrl})` }} onClick={onClick}>
      <div className="overlay">
        <h5>{title}</h5>
        <p>{subtitle}</p>
      </div>
    </div>
  );
};

export default JoinCard;