import React, { useState } from "react";
import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProfileCard.css";

interface ProfileCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  locationOrDate?: string;
  viewLink?: string;
  onDeleteUrl?: string;
  token?: string;
  onDelete?: (id: string) => void;
  extraButtons?: React.ReactNode;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  id,
  title,
  description,
  imageUrl,
  locationOrDate,
  viewLink,
  onDeleteUrl,
  token,
  onDelete,
  extraButtons,
}) => {
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!token || !onDeleteUrl) return;
    setLoading(true);
    try {
      await axios.delete(`${onDeleteUrl}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onDelete?.(id);
    } catch (err) {
      console.error("Failed to delete item:", err);
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  };

  return (
    <div className="profile-card">
      <Card className="card-root">
        {imageUrl && <CardMedia className="card-media" image={imageUrl} title={title} />}
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          {locationOrDate && (
            <Typography variant="body2" sx={{ color: "text.primary" }}>
              {locationOrDate}
            </Typography>
          )}
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {description}
          </Typography>
        </CardContent>
        <CardActions className="card-actions">
          {viewLink && (
            <Button size="small" onClick={() => navigate(viewLink)}>
              View Details
            </Button>
          )}
          {extraButtons}
          {!confirming ? (
            <Button
              size="small"
              variant="contained"
              color="error"
              onClick={() => setConfirming(true)}
            >
              Delete
            </Button>
          ) : (
            <>
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Confirm"}
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => setConfirming(false)}
              >
                Cancel
              </Button>
            </>
          )}
        </CardActions>
      </Card>
    </div>
  );
};

export default ProfileCard;