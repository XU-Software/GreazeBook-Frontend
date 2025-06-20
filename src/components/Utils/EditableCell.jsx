"use client";

import { TextField, TableCell } from "@mui/material";
import { formatToLocalCurrency } from "@/utils/currencyFormatter";

const EditableCell = ({
  label = "",
  value = "",
  name = "",
  editing = false,
  onChange = () => {},
  type = "text",
  convertToCurrency = false,
}) => {
  if (editing) {
    return (
      <TableCell>
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
      </TableCell>
    );
  }

  return (
    <TableCell>
      {type === "number" && convertToCurrency === true
        ? formatToLocalCurrency(value) || ""
        : value || ""}
    </TableCell>
  );
};

export default EditableCell;
