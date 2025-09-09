// Calculate Less VAT
export const calculateLessVat = (totalSales) =>
  Math.abs((totalSales || 0) / 1.12 - totalSales || 0) || 0;

// Calculate Less VAT
export const calculateAmountNetOfVat = (totalSales) => (totalSales || 0) / 1.12;
