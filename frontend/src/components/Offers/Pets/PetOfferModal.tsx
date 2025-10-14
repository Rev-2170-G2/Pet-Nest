import { Box,  Modal } from '@mui/material';
import PetOfferForm from './PetOfferForm';
import { Pet } from "../../../types/Pet";

interface PetOfferModalProps {
  pet: Pet;
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

function PetOfferModal({pet, open, handleClose}: PetOfferModalProps) { // props passed from PetDetails
  return (
  <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <PetOfferForm pet={pet} handleClose={handleClose} />
        </Box>
      </Modal>
    </div>
  )
}

export default PetOfferModal;