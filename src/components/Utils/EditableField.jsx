"use client";

import { TextField, Typography } from "@mui/material";
import { formatToLongDate } from "@/utils/dateFormatter";
import {
  formatToThousands,
  formatToThousandsWithDecimals,
} from "@/utils/quantityFormatter";
import { formatToLocalCurrency } from "@/utils/currencyFormatter";
import CurrencyTextField from "./CurrencyTextField";
import QuantityTextField from "./QuantityTextField";

const EditableField = ({
  label = "",
  value = "",
  name = "",
  editing = false,
  onChange = () => {},
  type = "text",
  isCurrency = false,
  isQuantity = false,
  isFloat = false, // NEW PROP
}) => {
  if (editing) {
    if (isCurrency) {
      return (
        <CurrencyTextField
          label={label}
          value={value}
          name={name}
          onChange={onChange}
          fullWidth
          size="small"
        />
      );
    }

    if (isQuantity) {
      return (
        <QuantityTextField
          label={label}
          value={value}
          name={name}
          onChange={onChange}
          fullWidth
          size="small"
        />
      );
    }

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
    <>
      <Typography variant="subtitle2">{label}</Typography>
      <Typography>
        {type === "date" && value !== ""
          ? formatToLongDate(value)
          : isCurrency
          ? formatToLocalCurrency(value)
          : isQuantity
          ? isFloat
            ? formatToThousandsWithDecimals(value)
            : formatToThousands(value)
          : value}
      </Typography>
    </>
  );
};

export default EditableField;
