import * as React from 'react';
import TextField from '@mui/material/TextField';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export default function BasicDateRangePicker({ onClickFilter, refreshData }) {
  const [value, setValue] = React.useState([null, null]);

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateRangePicker
          startText="Start date"
          endText="End date"
          style={{ height: "100px" }}
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          renderInput={(startProps, endProps) => (
            <React.Fragment>
              <TextField {...startProps} />
              <Box sx={{ mx: 2 }}> to </Box>
              <TextField {...endProps} />
            </React.Fragment>
          )}
        />
      </LocalizationProvider>
      <br />
      <Button onClick={() => onClickFilter(value)} style={{ marginBottom: "30px", marginRight: "20px" }} variant="contained">Filter</Button>
      <Button onClick={() => {
        setValue([null, null])
        // refreshData()
      }} style={{ marginBottom: "30px" }} variant="contained">Clear</Button>
      <br />
    </>
  );
}
