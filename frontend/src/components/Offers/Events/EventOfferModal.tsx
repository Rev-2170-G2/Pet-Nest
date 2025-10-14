import { Box,  Modal } from '@mui/material';
import { Event } from "../../../types/Event";
import EventOfferForm from './EventOfferForm';

interface EventOfferModalProps {
  event: Event;
  open: boolean;
  handleClose: () => void;
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  height: 550,
  bgcolor: 'background.paper',
  border: '2px solid #24453fff',
  boxShadow: 24,
  borderRadius: 10,
  p: 4,
};

function EventOfferModal({event, open, handleClose}: EventOfferModalProps) { // props passed from EventDetails
  return (
  <div>
      <Modal
        open={open}
        onClose={handleClose} 
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <EventOfferForm event={event} handleClose={handleClose}/>
        </Box>
      </Modal>
    </div>
  )
}

export default EventOfferModal;