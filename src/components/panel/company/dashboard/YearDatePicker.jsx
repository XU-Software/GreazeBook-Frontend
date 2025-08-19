"use client";

import React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const YearPicker = ({ selectedYear, onChange }) => {
  return (
    <DatePicker
      views={["year"]} // Only allow year selection
      label="Select Year"
      value={selectedYear ? dayjs(new Date(selectedYear, 0, 1)) : null} // Convert number to Date
      onChange={(date) => {
        if (date) onChange(date.year());
      }}
      disableFuture
      slotProps={{ textField: { size: "small" } }}
      sx={{ maxWidth: "10rem" }}
    />
  );
};

export default YearPicker;
