import { FormLabel, FormControlLabel, Checkbox } from '@mui/material'
import { Pet } from '../../types/Pet'

interface ModalCheckBoxProps{
    pet: Pet;
    serviceSelection: string[];
    handleServiceSelectionChange: (service: string) => void;
}

function ModalCheckBox({ pet, serviceSelection, handleServiceSelectionChange }: ModalCheckBoxProps) {
  return (
    <>
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
        )
        })}
    </>
  )
}

export default ModalCheckBox