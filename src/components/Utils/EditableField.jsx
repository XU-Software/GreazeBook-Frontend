"use client";

import { TextField, Typography } from "@mui/material";
import { formatToLongDate } from "@/utils/dateFormatter";

const EditableField = ({
  label = "",
  value = "",
  name = "",
  editing = false,
  onChange = () => {},
  type = "text",
}) => {
  if (editing) {
    return (
      <TextField
        label={label}
        value={value}
        name={name}
        fullWidth
        size="small"
        type={type}
        variant="outlined"
        onChange={onChange}
        slotProps={{ inputLabel: { shrink: true } }}
      />
    );
  }

  return (
    <Typography>
      <strong>{label}:</strong>{" "}
      {type === "date" && value !== "" ? formatToLongDate(value) : value}
    </Typography>
  );
};

export default EditableField;
