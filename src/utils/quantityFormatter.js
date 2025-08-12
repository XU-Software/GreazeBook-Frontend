import numeral from "numeral";

// Universal format for quantity
const formatNumber = (value) => {
  if (value == null || isNaN(value)) return ""; // safeguard
  return numeral(value).format(value % 1 === 0 ? "0,0" : "0,0.00");
};

export { formatNumber };
