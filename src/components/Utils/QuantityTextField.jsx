"use client";

import { NumericFormat } from "react-number-format";
import { TextField } from "@mui/material";

const QuantityTextField = ({ value, onChange, name, ...props }) => {
  return (
    <NumericFormat
      value={value}
      onValueChange={({ value: numericValue }) => {
        onChange({
          target: {
            name,
            value: numericValue,
          },
        });
      }}
      thousandSeparator
      allowNegative={false}
      customInput={TextField}
      name={name}
      {...props}
    />
  );
};

export default QuantityTextField;
