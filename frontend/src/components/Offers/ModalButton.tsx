import { Button } from '@mui/material'
import React from 'react'

function ModalButton() {
  return (
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
          alignSelf: "center", 
        }}
      >
        Request Service
    </Button>
  )
}

export default ModalButton