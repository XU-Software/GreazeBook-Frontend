import numeral from "numeral";

// Format float or integer to thousands with commas (e.g., 12345 -> 12,345)
const formatToThousands = (value) => numeral(value).format("0,0");

// Format float or integer to thousands with commas and decimal
const formatToThousandsWithDecimals = (value) =>
  numeral(value).format("0,0.00");

export { formatToThousands, formatToThousandsWithDecimals };
