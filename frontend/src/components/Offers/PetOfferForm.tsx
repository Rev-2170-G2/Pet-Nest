import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormLabel,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  TextField,
  Button,
} from "@mui/material";
import { PetOfferFormProps } from "../../types/Pet";
import { Event } from "../../types/Event";
import { Offer } from "../../types/Offer";
import axios from "axios";
import { useEffect, useState } from "react";

// TODO: replace with actual id using authContextProvider
const id = "7kq0K";

function PetOfferForm({ pet }: PetOfferFormProps) {
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [requesterSK, setRequesterSK] = useState("");
  const [serviceSelection, setServiceSelection] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventsByUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/events/user/${id}`);
        console.log(`From fetchEventsByUser: ${JSON.stringify(response.data.data)}`);

        response.data.data.unshift({ name: "request as a individual", id: id });
        setUserEvents(response.data.data);
      } catch (error) {
        console.log(`Error fetching events: ${error}`);
      } finally {
        setLoading(false);
      }
    };
    fetchEventsByUser();
  }, []);

  if (loading) return <p>Loading...</p>;

  function handleRequesterChange(event: string) {
    setRequesterSK(event);
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
    const typetag = formData.get("requesterSK") !== id ? "EVENT#" : "USER#";
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
          'http://localhost:3000/api/offers', 
          offer,
          { headers: { 'Content-Type': 'application/json' } }
        );
        return response;
    } catch (error) {
        console.log(`Error creating offer: ${error}`);
    } finally {
        setLoading(false);
    }
  }

  if (loading) return <p>Submitting...</p>

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ fontFamily: "Roboto", ml: 3 }}
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
        <InputLabel
          shrink
          id="requesterSK"
          htmlFor="requesterSK"
          sx={{ mt: 15, fontSize: 17, color: "black" }}
        >
          Requester
        </InputLabel>
        <Select
          labelId="requesterSK"
          name="requesterSK"
          label="RequesterSK"
          displayEmpty
          sx={{ height: 56, minWidth: 250, mt: 5, color: "black" }}
          renderValue={(requesterSK: string) => {
            if (!requesterSK) return "Please select an option";
            const selectedEvent = userEvents.find(
              (event) => event.id === requesterSK
            );
            return selectedEvent ? selectedEvent.name : "";
          }}
          value={requesterSK}
          onChange={(event) => handleRequesterChange(event.target.value)}
        >
          {userEvents.map((event) => (
            <MenuItem selected key={event.id} value={event.id}>
              {event.name}
            </MenuItem>
          ))}
        </Select>

        {/* services information */}
        <FormLabel
          component="legend"
          sx={{ mt: 2, ml: 1, fontSize: 14, color: "black" }}
        >
          Services
        </FormLabel>
        {pet.services.map(
          (serviceObj: { service: string; price: number }, index: number) => {
            return (
              <>
                <FormControlLabel
                  key={index}
                  sx={{ ml: 2, mt: -1 }}
                  label={`${serviceObj.service} ➜ $${serviceObj.price}`}
                  control={
                    <Checkbox
                      name="services"
                      value={serviceObj.service}
                      checked={serviceSelection.includes(serviceObj.service)}
                      onChange={() =>
                        handleServiceSelectionChange(serviceObj.service)
                      }
                    />
                  }
                ></FormControlLabel>
              </>
            );
          }
        )}

        {/* description information */}
        <InputLabel shrink id="description" htmlFor="description"></InputLabel>
        <TextField
          id="outlined-basic"
          name="description"
          label="Description of Request"
          variant="outlined"
          multiline
          required
          sx={{ mt: 3, fontSize: 18, color: "black" }}
        ></TextField>
      </FormControl>

      <Button
        type="submit"
        variant="contained"
        color="success"
        size="large"
        sx={{
          mt: 2,
          px: 4,
          fontSize: 20,
          textTransform: "none",
          borderRadius: 2,
        }}
      >
        Request Service
      </Button>
    </Box>
  );
}

export default PetOfferForm;
