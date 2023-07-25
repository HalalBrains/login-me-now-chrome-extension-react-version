import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function Selector({classNames, handleAccessHoursChange, name, accessHours, setAccessHours}) {




  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Save For</InputLabel>
        <Select
        className={classNames}
        name={name}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={accessHours}
          label="accessHours"
          onChange={handleAccessHoursChange}
        >
          <MenuItem value="day">A Day</MenuItem>
          <MenuItem value="week2">A Week</MenuItem>
          <MenuItem value="month">A Month</MenuItem>
          <MenuItem value="year">A Year</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}