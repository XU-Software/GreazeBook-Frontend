import numeral from "numeral";

// Format float to local currency
const formatToLocalCurrency = (float) => `₱${numeral(float).format("0,0.00")}`;

export { formatToLocalCurrency };
