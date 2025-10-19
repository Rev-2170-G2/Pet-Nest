import React from "react";
import type { Service } from '../PetForm/PetForm';
import MultiPhotoInput from './MultiPhotoInput/MultiPhotoInput';
import MultiServiceInput from './MultiServiceInput/MultiServiceInput';

// runtime discriminator for switching data types based on input
type MultiInputProps = 
  | { label: 'Photos'; preSet: string[]; onChange?: (values: string[]) => void}
  | { label: 'Services'; preSet: Service[]; onChange?: (values: Service[]) => void};

const MultiInput: React.FC<MultiInputProps> = ({ label, preSet, onChange }) => {

  return (
    <>
    {label === 'Photos' ? <MultiPhotoInput onChange={onChange} label='Photos' preSet={preSet}/> : <MultiServiceInput onChange={onChange} label='Services' preSet={preSet}/>} 
    </>
  );
};

export default MultiInput;