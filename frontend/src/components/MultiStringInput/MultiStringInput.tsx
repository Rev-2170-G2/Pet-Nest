import React, { useState, KeyboardEvent, ChangeEvent } from "react";
import { Form, Button, Badge, InputGroup } from "react-bootstrap";

interface MultiStringInputProps {
  label: string;
  onChange?: (values: {service: string; price: number}) => void;
}

const MultiStringInput: React.FC<MultiStringInputProps> = ({ label, onChange }) => {

  type service = {
    service: string,
    price: number
  }
  const [values, setValues] = useState<service[]>([]);
  const [serviceValue, setServiceValue] = useState('');
  const [priceValue, setPriceValue] = useState('0');

  const handleAdd = () => {
    const trimmedSV = serviceValue.trim();
    const convertedPV = parseFloat(priceValue);
    if (trimmedSV && convertedPV !== 0 && !values.includes({service: trimmedSV, price: convertedPV})) {
      const updated = [...values, {service: trimmedSV, price: convertedPV}];
      setValues(updated);
      onChange?.(updated);
    }
    setServiceValue('');
    setPriceValue('0');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleRemove = (valueToRemove: service) => {
    const updated = values.filter((v) => v !== valueToRemove);
    console.log(updated);
    setValues(updated);
    onChange?.(updated);
  };

  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <InputGroup>
        <Form.Control
          type="text"
          value={serviceValue}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setServiceValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a value and hit Enter"
        />
        <InputGroup.Text id="inputGroupPrepend">$</InputGroup.Text>
        <Form.Control
          type="number"
          value={priceValue}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPriceValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter a dollar amount"
        />
        <Button variant="primary" onClick={handleAdd}>Add</Button>
      </InputGroup>

      <div className="mt-2">
        {values.map((v) => (
          <Badge
            key={v.service}
            pill
            bg="secondary"
            className="me-2"
            style={{ cursor: "pointer" }}
            onClick={() => handleRemove(v)}
          >
            {v.service} : ${v.price} ✕
          </Badge>
        ))}
      </div>
    </Form.Group>
  );
};

export default MultiStringInput;
