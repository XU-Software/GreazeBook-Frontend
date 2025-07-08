"use client";

import React, { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Box, Button } from "@mui/material";

export default function DateRangePicker({
  onFilter = () => {},
  onClear = () => {},
}) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleSubmit = () => {
    if (!startDate || !endDate) return;
    onFilter(startDate.toString(), endDate.toString());
  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    onClear();
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
        slotProps={{ textField: { size: "small" } }}
        sx={{ maxWidth: "10rem" }}
      />
      <DatePicker
        label="End Date"
        value={endDate}
        onChange={(newValue) => setEndDate(newValue)}
        slotProps={{ textField: { size: "small" } }}
        sx={{ maxWidth: "10rem" }}
      />
      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={!startDate || !endDate}
      >
        Filter
      </Button>
      <Button
        variant="outlined"
        onClick={handleClear}
        disabled={!startDate || !endDate}
      >
        Clear
      </Button>
    </Box>
  );
}
