import { InputLabel, TextField } from '@mui/material'
import React from 'react'

function ModalTextField() {
  return (
    <>
        <InputLabel shrink id="description" htmlFor="description"></InputLabel>
        <TextField
          id="outlined-basic"
          name="description"
          label="Description of Request"
          variant="outlined"
          multiline
          required
          sx={{ mt: 3, fontSize: 18, color: "black" }}
        >
        </TextField>  
    </>
  )
}

export default ModalTextField