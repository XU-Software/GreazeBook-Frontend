"use client";

import { TextField, TableCell } from "@mui/material";
import { formatToLocalCurrency } from "@/utils/currencyFormatter";
import { formatNumber } from "@/utils/quantityFormatter";
import CurrencyTextField from "./CurrencyTextField";
import QuantityTextField from "./QuantityTextField";
import { formatToLongDate } from "@/utils/dateFormatter";

const EditableCell = ({
  label = "",
  value = "",
  name = "",
  editing = false,
  onChange = () => {},
  type = "text",
  isCurrency = false,
  isQuantity = false,
}) => {
  if (editing) {
    if (isCurrency) {
      return (
        <TableCell>
          <CurrencyTextField
            label={label}
            value={value}
            name={name}
            onChange={onChange}
            fullWidth
            size="small"
          />
        </TableCell>
      );
    }

    if (isQuantity) {
      return (
        <TableCell>
          <QuantityTextField
            label={label}
            value={value}
            name={name}
            onChange={onChange}
            fullWidth
            size="small"
          />
        </TableCell>
      );
    }

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

  let displayValue = value;

  if (type === "date" && value !== "") {
    displayValue = formatToLongDate(value);
  } else if (isCurrency) {
    displayValue = formatToLocalCurrency(value);
  } else if (isQuantity) {
    displayValue = formatNumber(value);
  }

  // return (
  //   <TableCell>
  //     {type === "number" && convertToCurrency === true
  //       ? formatToLocalCurrency(value) || ""
  //       : value || ""}
  //   </TableCell>
  // );
  return <TableCell>{displayValue || ""}</TableCell>;
};

export default EditableCell;
