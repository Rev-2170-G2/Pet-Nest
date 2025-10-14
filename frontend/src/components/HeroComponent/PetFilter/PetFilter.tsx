import { useState } from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
//https://mui.com/material-ui/react-select/

export default function PetFilter({ onSelectType }: { onSelectType: (type: string) => void }) {
  const types = ["Cat", "Dog", "Bird"];
  const [selected, setSelected] = useState("");

  const handleChange = (event: any) => {
    const value = event.target.value;
    setSelected(value);
    onSelectType(value);
  };

  return (
    <FormControl fullWidth sx={{ maxWidth: 250, m: 2 }}>
        <InputLabel id="pet-type-label">Filter by Type</InputLabel>
        <Select
            labelId="pet-type-label"
            value={selected}
            label="Filter by Type"
            onChange={handleChange}
        >
            {types.map((type) => (
            <MenuItem key={type} value={type}>
                {type}
            </MenuItem>
            ))}
        </Select>
    </FormControl>
  );
}