// Hooks, Context, and Utils
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import axios from "axios";

// Types
import { EventOfferFormProps } from "../../../types/Event";
import { Pet } from "../../../types/Pet";
import { Offer } from "../../../types/Offer";

// Modal & MUI Components
import ModalButton from "../ModalButton";
import ModalTextField from "../ModalTextField";
import ModalCheckBox from "../ModalCheckBox";
import ModalSelect from "../ModalSelect";
import { FormControl, FormLabel, Typography, Box } from "@mui/material";

function EventOfferForm({ event, userPets, handleClose }: EventOfferFormProps) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const { user } = useAuth();
  const userId = user?.id.split("#")[1];
  const [requesterSK, setRequesterSK] = useState<string>("");
  const [serviceSelection, setServiceSelection] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  function handleRequesterChange(pet: string) {
    setRequesterSK(pet);
  }

  function handleServiceSelectionChange(service: string) {
    setServiceSelection((prev) =>
      prev.includes(service)
        ? prev.filter((serviceName) => serviceName !== service)
        : [...prev, service]
    );
  }

  function findPetByPetId(requesterSK: string): Pet {
    const currentPet = userPets.find((pet) => pet.id === requesterSK) as Pet;
    return currentPet;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); 
    const formData = new FormData(e.currentTarget);
    const typetag = formData.get("requesterSK") !== userId ? "PET#" : "USER#";
    const formattedRequesterSK = typetag + formData.get("requesterSK");
    const offer: Offer = {
      requesterSK: formattedRequesterSK,
      requestedSK: "EVENT#" + event.id,
      requestedOwnerId: event["PK"],
      services: serviceSelection,
      description: formData.get("description") as string,
    };
    console.log("Form submitted. The new Offer is:", offer);

    try {
      setLoading(true);
      const response = await axios.post(
        `${baseUrl}/offers`,
        offer,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      console.log("Offer submitted:", response.data);
      handleClose();
    } catch (error) {
      console.log(`Error creating offer: ${error}`);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p>Loading..</p>;

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        overflow: "hidden auto",
      }}
    >
      <FormControl component="fieldset">
        <FormLabel
          component="legend"
          sx={{
            mb: 2,
            fontSize: 24,
            fontWeight: "bold",
            color: "primary.main",
          }}
        >
          Event Service Request Form
        </FormLabel>

        {/* requested pet information */}
        <Typography variant="h5" sx={{ mt: 1, fontSize: 16, color: "black" }}>
          Event requested: {event.name}
        </Typography>

        {/* requesterSK information */}
        <ModalSelect
          requesterSK={requesterSK}
          userPetsOrEvents={userPets}
          handleRequesterChange={handleRequesterChange}
        />

        {/* services information */}
        {requesterSK && findPetByPetId(requesterSK) && (
        <ModalCheckBox
          pet={findPetByPetId(requesterSK)}
          serviceSelection={serviceSelection}
          handleServiceSelectionChange={handleServiceSelectionChange}
        />
        )}

        {/* description information */}
        <ModalTextField />

      </FormControl>
      <ModalButton />
    </Box>
  );
}

export default EventOfferForm;