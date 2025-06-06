import * as React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField, Box, Button } from "@mui/material";

export default function FreeDateRangePicker({ onFilter }) {
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);

  const handleSubmit = () => {
    if (startDate && endDate) {
      onFilter({
        startDate: startDate.toISOString().slice(0, 10),
        endDate: endDate.toISOString().slice(0, 10),
      });
    }
  };

  return (
    <Box
      sx={{
        gap: 1,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <DatePicker
        label="Start Date"
        value={startDate}
        onChange={(newValue) => setStartDate(newValue)}
        renderInput={(params) => <TextField {...params} size="small" />}
      />
      <DatePicker
        label="End Date"
        value={endDate}
        onChange={(newValue) => setEndDate(newValue)}
        renderInput={(params) => <TextField {...params} size="small" />}
      />
      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={!startDate || !endDate}
      >
        Filter
      </Button>
    </Box>
  );
}
