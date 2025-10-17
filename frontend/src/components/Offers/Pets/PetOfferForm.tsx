// Hooks, Context, and Utils
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import axios from "axios";

// Types
import { PetOfferFormProps } from "../../../types/Pet";
import { Event } from "../../../types/Event";
import { Offer, IndividualUser } from "../../../types/Offer";

// Modal & MUI Components
import ModalButton from "../ModalButton";
import ModalTextField from "../ModalTextField";
import ModalCheckBox from "../ModalCheckBox";
import ModalSelect from "../ModalSelect";
import { FormControl, FormLabel, Typography, Box } from "@mui/material";

function PetOfferForm({ pet, handleClose }: PetOfferFormProps) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";
  const { user } = useAuth();
  const userId = user?.id.split("#")[1];
  const [userEvents, setUserEvents] = useState<Event[] | IndividualUser[]>([{ name: "request as a individual", id: userId  ?? ""}]);
  const [requesterSK, setRequesterSK] = useState<string>("");
  const [serviceSelection, setServiceSelection] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventsByUser = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/events/user/${userId}`
        );
        console.log(
          `From fetchEventsByUser: ${JSON.stringify(response.data.data)}`
        );

        setUserEvents((prev) => [...prev, ...response.data.data]);
      } catch (error) {
        console.log(`Error fetching events: ${error}`);
      } finally {
        setLoading(false);
      }
    };
    fetchEventsByUser();
  }, [userId]);

  function handleRequesterChange(value: string) {
    setRequesterSK(value);
  }

  function handleServiceSelectionChange(service: string) {
    setServiceSelection((prev) =>
      prev.includes(service)
        ? prev.filter((serviceName) => serviceName !== service)
        : [...prev, service]
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // prevent page reload
    const formData = new FormData(event.currentTarget);
    const typetag = formData.get("requesterSK") !== userId ? "EVENT#" : "USER#";
    const formattedRequesterSK = typetag + formData.get("requesterSK");
    const offer: Offer = {
      requesterSK: formattedRequesterSK,
      requestedSK: "PET#" + pet.id,
      requestedOwnerId: pet["PK"],
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
          Pet Service Request Form
        </FormLabel>

        {/* requested pet information */}
        <Typography variant="h5" sx={{ mt: 1, fontSize: 16, color: "black" }}>
          Pet requested: {pet.name}
        </Typography>

        {/* requesterSK information */}
        <ModalSelect
          requesterSK={requesterSK}
          userPetsOrEvents={userEvents}
          handleRequesterChange={handleRequesterChange}
        />

        {/* services information */}
        <ModalCheckBox
          pet={pet}
          serviceSelection={serviceSelection}
          handleServiceSelectionChange={handleServiceSelectionChange}
        />

        {/* description information */}
        <ModalTextField />

      </FormControl>
      <ModalButton />
    </Box>
  );
}

export default PetOfferForm;
