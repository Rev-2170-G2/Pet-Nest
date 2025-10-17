import { InputLabel, TextField } from '@mui/material'

function ModalTextField() {
  return (
    <>
        <InputLabel shrink id="description" htmlFor="description"></InputLabel>
        <TextField
          id="outlined-basic"
          name="description"
          label="Description"
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