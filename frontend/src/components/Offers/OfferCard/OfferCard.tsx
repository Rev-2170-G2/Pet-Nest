import { CardMedia, CardContent, Typography, CardActions, CardActionArea } from "@mui/material";
import { Card, Alert, Button } from '@mui/material';
import { FaCat } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import PetsIcon from "@mui/icons-material/Pets";
import axios from "axios";
import { Offer, OfferCardProps } from "../../../types/Offer";
import "./styles.css";
import { toast } from "react-toastify";

const DEFAULT_IMAGE = "https://cdn.pixabay.com/photo/2016/12/05/09/36/application-1883452_1280.jpg";
const DEFAULT_IMAGE_2 ="https://cdn.pixabay.com/photo/2016/07/21/14/18/dog-1532627_1280.png";

export default function OfferCard( { url, tab } : OfferCardProps) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const { user } = useContext(AuthContext);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [disabledValue, setDisabledValue ] = useState<boolean>(false)

  useEffect(() => {
    if (!user?.token) return;    
    axios
      .get(url, { headers: { Authorization: `Bearer ${user?.token}` } })
      .then((res) => {
        setOffers(Array.isArray(res.data.data) ? res.data.data : []);
        console.log("From front end: ", res.data.data);
      })
      .catch((err) => console.error(err));
  }, [url, baseUrl, user?.token]);


  const updateOfferStatus = async (offer: Offer, updatedStatus:  "pending" | "approved" | "denied") => {
    console.log("User from AuthContext:", user);

    try {
      const response = await axios.put(`${baseUrl}/offers/${offer.id}/status`, 
        { requestedSK : offer.requestedSK.split("#")[1], status: updatedStatus },
        { headers: { Authorization: `Bearer ${user?.token}` } })
      console.log("Response from updating offer status from the frontend: ", response)
      return response;
    } catch (error) {
      console.log(`Error updating offer status: ${error}`)
    }
  }

  async function handleStatusChange(updatedOffer: Offer, updatedStatus:  "pending" | "approved" | "denied"){
    if (updatedOffer.status !== "pending") {
      toast(`Sorry, offer has already been processed. Cannot change to ${updatedOffer.status}.`)
      return null;
    }

    try {
      const response = await updateOfferStatus(updatedOffer, updatedStatus);

    if (response){
      setOffers((prevOffers) =>
        prevOffers.map((offer) =>
          offer.id === updatedOffer.id ? { ...offer, status: updatedStatus } : offer
      ));
    }
    } catch (error) {
       console.log(`Error updating offer status: ${error}`)     
    } finally {
      setDisabledValue(true);
    }
    return null;
  }

  return (
    <div className="d-flex flex-column">
      <div className="offer-container">
        {offers.length === 0 ? (
          <p>No offers</p>
        ) : (
          offers.map((offer, index) => (
            <div key={index} className="offer-card">
              <Card
                className="card-root"
                sx={{ fontFamily: "Helvetica, Arial, sans-serif" }}
              >
                {/* Buttons Approve or Deny Offer */}
                {offer && offer.status !== "pending" && (
                  <Alert
                    severity={
                      offer.status === "approved" ? "success" : "warning"
                    }
                    variant="outlined"
                    sx={{ width: 500, borderRadius: 1 }}
                  >
                    {offer.status}
                  </Alert>
                )}

                {/* Default Image to Display of Offer - sent & request have different displays */}
                <CardMedia
                  className="card-media"
                  image={url.includes("sent") ? DEFAULT_IMAGE : DEFAULT_IMAGE_2}
                  // title={pet.entity}
                />

                {/* Card links to the entity page */}
                <CardActionArea
                  component="a"
                  href={`${
                    offer.requestedSK.split("#")[0].toLowerCase() + "s"
                  }/${offer.requestedSK.split("#")[1]}`}
                >
                  {/* Header of Offer - currently just PetIcon */}
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      sx={{ mb: 2 }}
                    >
                      <PetsIcon />{" "}
                    </Typography>

                    {/* Description of Offer */}
                    <Typography
                      variant="body2"
                      sx={{ color: "text.primary", mb: 0.5, fontSize: "15px" }}
                    >
                      <span>
                        <strong>Description: </strong>
                      </span>
                      {offer.description}
                    </Typography>

                    {/* Status of Offer */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        mb: 0.5,
                        fontSize: "15px",
                      }}
                    >
                      <span>
                        <strong>Status: </strong>
                      </span>
                      {offer.status}
                    </Typography>

                    {/* id of Offer => necessary to include? */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        mb: 0.5,
                        fontSize: "15px",
                      }}
                    >
                      <span>
                        <strong>Offer id: </strong>
                      </span>
                      {offer.id}
                    </Typography>

                    {/* Time Created of Offer */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        mb: 0.5,
                        fontSize: "15px",
                      }}
                    >
                      <span>
                        <strong>Created at: </strong>
                      </span>
                      {offer && offer.createdAt && new Date(offer.createdAt).toLocaleString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>

                    {/* List of Pet Services (Requests or Offered) of Offer*/}
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        mb: 0.5,
                        fontSize: "15px",
                      }}
                    >
                      <span>
                        <strong>Services: </strong>
                      </span>
                      {offer.services &&
                        offer.services.map((service, index) =>
                          index < offer.services.length - 1 ? (
                            <span key={index}>{`${service}, `}</span>
                          ) : (
                            <span key={index}>{`${service} `}</span>
                          )
                        )}
                    </Typography>

                    {/* TODO: 
                       [ ] Add Price ? */}

                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        mb: 0.5,
                        mt: 1,
                        fontSize: "15px",
                      }}
                    >
                      <span>
                        <h5 style={{     
                          fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                          fontWeight: 500,
                          color: "#6d7280ff" }}>
                          <strong>Click here for more info</strong>
                          </h5>
                      </span>
                    </Typography>
                  </CardContent>
                </CardActionArea>

                {/* Buttons Approve or Deny Offer */}
                {tab === "received" ? (
                  <CardActions className="card-actions">
                    <Button
                      disabled={disabledValue}
                      onClick={() => handleStatusChange(offer, "approved")}
                      sx={{
                        opacity: offer.status !== "pending" ? 0.5 : 1,
                      }}
                    >
                      <FaCat className="fa-cat" /> Approve
                    </Button>
                    <Button
                      disabled={disabledValue}
                      onClick={() => handleStatusChange(offer, "denied")}
                      sx={{
                        opacity: offer.status !== "pending" ? 0.5 : 1,
                      }}
                    >
                      <FaCat className="fa-cat" /> Deny
                    </Button>
                  </CardActions>
                ) : null}
              </Card>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
