"use client";

import React, { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Box, Button } from "@mui/material";
import dayjs from "dayjs";

export default function DateRangePicker({
  onFilter = () => {},
  onClear = () => {},
}) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleSubmit = () => {
    if (!startDate || !endDate) return;
    onFilter(
      //Format the date to start of the day to match the format when filtering against prisma date format
      dayjs(startDate).startOf("day").toISOString(),
      dayjs(endDate).endOf("day").toISOString()
    );
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
        minDate={startDate}
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
