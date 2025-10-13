import React, { useState, KeyboardEvent, ChangeEvent } from "react";
import type { Service } from '../PetForm/PetForm';
import MultiPhotoInput from './MultiPhotoInput/MultiPhotoInput';
import MultiServiceInput from './MultiServiceInput/MultiServiceInput';

type MultiStringInputProps = {
  label: string;
  onChange?: ( values: Service[] | string[]) => void;
}
const MultiStringInput: React.FC<MultiStringInputProps> = ({ label, onChange }) => {

  return (
    <>
    {label === 'Photos' ? <MultiPhotoInput onChange={onChange} label='Photos'/> : <MultiServiceInput onChange={onChange} label='Services'/>} 
    </>
  );
};

export default MultiStringInput;
