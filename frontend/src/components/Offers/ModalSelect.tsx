import { InputLabel, Select, MenuItem } from '@mui/material';
import { Event } from "../../types/Event";
import { Pet } from "../../types/Pet";
import { IndividualUser } from '../../types/Offer';

interface ModalSelectProps{
    requesterSK: string;
    userPetsOrEvents: (Event | Pet | IndividualUser)[];
    handleRequesterChange: (value: string) => void;
}

function ModalSelect({ requesterSK, userPetsOrEvents, handleRequesterChange }: ModalSelectProps) {
  return (
    <>
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
          value={requesterSK}
          onChange={(event) => handleRequesterChange(event.target.value)}
          renderValue={(selected) => {
          if (!selected) return "Please select an option";
            const selectedItem = userPetsOrEvents.find(
              (eventOrPet) => eventOrPet.id === selected
            );
            return selectedItem ? selectedItem.name : "";
          }}
        >
          {userPetsOrEvents.map((petOrEvent, index) => (
            <MenuItem key={index} value={petOrEvent.id}>
              {petOrEvent.name}
            </MenuItem>
          ))}
        </Select>
    </>
  )
}

export default ModalSelect