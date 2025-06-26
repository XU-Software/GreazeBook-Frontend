"use client";

import { NumericFormat } from "react-number-format";
import { TextField } from "@mui/material";

const CurrencyTextField = ({ value, onChange, name, ...props }) => {
  return (
    <NumericFormat
      value={value}
      onValueChange={(values) => {
        const { value: numericValue } = values;
        onChange({
          target: {
            name,
            value: numericValue,
          },
        });
      }}
      thousandSeparator
      prefix="₱"
      customInput={TextField}
      name={name}
      {...props}
    />
  );
};

export default CurrencyTextField;
