import { useState, KeyboardEvent, ChangeEvent, useEffect } from 'react';
import { Form, Button, Badge, InputGroup } from "react-bootstrap";

type Props = {
    label: string;
    onChange?: ( values: string[]) => void;
    preSet?: string[] | null;
}

export default function MultiPhotoInput({onChange, label, preSet}: Props) {
    
      const [values, setValues] = useState<string[]>([]);
      const [inputValue, setInputValue] = useState<string>('');
    
      const handleAdd = () => {
          const trimmed = inputValue.trim().toLowerCase();
          if (trimmed && !values.includes(trimmed)) {
            const updated = [...values, trimmed];
            setValues(updated);
            onChange?.(updated);
          }
          setInputValue('');
      };
    
      const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleAdd();
        }
      };
    
      const handleRemove = (valueToRemove: string) => {
        const updated = values.filter((v) => v !== valueToRemove);
        setValues(updated);
        onChange?.(updated);
      };

      useEffect(() => {
        if (preSet) {
          for (const item of preSet) {
            const updated = [ ...values, item]
            setValues(updated);
            onChange?.(updated);
          }
        }
      }, [preSet])

  return (
    <>
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <InputGroup>
        <Form.Control
          type="text"
          value={inputValue}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Share a photo link and press enter"
        />
        <Button variant="primary" onClick={handleAdd}>Add</Button>
      </InputGroup>

      <div className="mt-2">
        {values.map((v) => (
          <Badge
            key={v}
            bg="secondary"
            className="me-2"
            style={{ cursor: "pointer", zIndex: 1 }}
            onClick={() => handleRemove(v)}
          >
            {v.length > 25 ? v.slice(0, 26) + '...' : v} ✕
          </Badge>
        ))}
      </div>
    </Form.Group>
    </>
  )
}