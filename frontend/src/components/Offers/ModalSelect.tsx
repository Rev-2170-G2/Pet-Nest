import { InputLabel, Select, MenuItem } from '@mui/material';
import { Event } from "../../types/Event";
import React from 'react'

interface ModalSelectProps{
    requesterSK: string;
    userEvents: Event[];
    handleRequesterChange: (event: string) => void;
}

function ModalSelect({ requesterSK, userEvents, handleRequesterChange }: ModalSelectProps) {
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
    </>
  )
}

export default ModalSelect