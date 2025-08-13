import numeral from "numeral";

// Format number like 85.5 → "85.50%"
const formatToPercentage = (value) => numeral(value).format("0.00") + "%";

export { formatToPercentage };
