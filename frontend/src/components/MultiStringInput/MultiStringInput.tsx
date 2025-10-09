import React, { useState, KeyboardEvent, ChangeEvent } from "react";
import { Form, Button, Badge, InputGroup } from "react-bootstrap";

interface MultiStringInputProps {
  label: string;
  onChange?: (values: string[]) => void;
}

const MultiStringInput: React.FC<MultiStringInputProps> = ({ label, onChange }) => {
  const [inputValue, setInputValue] = useState("");
  const [values, setValues] = useState<string[]>([]);

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !values.includes(trimmed)) {
      const updated = [...values, trimmed];
      setValues(updated);
      onChange?.(updated);
    }
    setInputValue("");
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

  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <InputGroup>
        <Form.Control
          type="text"
          value={inputValue}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a value and hit Enter"
        />
        <Button variant="primary" onClick={handleAdd}>Add</Button>
      </InputGroup>

      <div className="mt-2">
        {values.map((v) => (
          <Badge
            key={v}
            pill
            bg="secondary"
            className="me-2"
            style={{ cursor: "pointer" }}
            onClick={() => handleRemove(v)}
          >
            {v} ✕
          </Badge>
        ))}
      </div>
    </Form.Group>
  );
};

export default MultiStringInput;
