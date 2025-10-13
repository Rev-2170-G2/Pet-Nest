import React from "react";
import type { Service } from '../PetForm/PetForm';
import MultiPhotoInput from './MultiPhotoInput/MultiPhotoInput';
import MultiServiceInput from './MultiServiceInput/MultiServiceInput';

type MultiInputProps = {
  label: string;
  onChange?: ( values: Service[] | string[]) => void;
}
const MultiInput: React.FC<MultiInputProps> = ({ label, onChange }) => {

  return (
    <>
    {label === 'Photos' ? <MultiPhotoInput onChange={onChange} label='Photos'/> : <MultiServiceInput onChange={onChange} label='Services'/>} 
    </>
  );
};

export default MultiInput;
