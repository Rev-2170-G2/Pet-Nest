import React from "react";
import type { Service } from '../PetForm/PetForm';
import MultiPhotoInput from './MultiPhotoInput/MultiPhotoInput';
import MultiServiceInput from './MultiServiceInput/MultiServiceInput';

// runtime discriminator for switching data types based on input
type MultiInputProps = 
  | { label: 'Photos'; onChange?: (values: string[]) => void}
  | { label: 'Services'; onChange?: (values: Service[]) => void};

const MultiInput: React.FC<MultiInputProps> = ({ label, onChange }) => {

  return (
    <>
    {label === 'Photos' ? <MultiPhotoInput onChange={onChange} label='Photos'/> : <MultiServiceInput onChange={onChange} label='Services'/>} 
    </>
  );
};

export default MultiInput;