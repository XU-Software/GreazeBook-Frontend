import { formatToLocalCurrency } from "./currencyFormatter";
import { formatNumber } from "./quantityFormatter";
import { formatDate } from "./dateFormatter";

// Mapping the fields array from the template
export const mapTemplateFields = (fields, bookingData) => {
  return fields.map((f) => {
    let label = "";

    switch (f.name) {
      case "invoiceDate":
        label = formatDate(new Date());
        break;
      case "accountName":
        label = bookingData.account?.accountName ?? "";
        break;
      case "address":
        label = bookingData.account?.location ?? "";
        break;
      case "term":
        label = bookingData.term
          ? `${formatNumber(bookingData.term)} days`
          : "";
        break;
      case "totalSales":
        label = formatToLocalCurrency(bookingData.totalAmount);
        break;
      case "lessVat":
        label = formatToLocalCurrency(
          Math.abs(
            (bookingData.totalAmount || 0) / 1.12 - bookingData.totalAmount || 0
          ) || 0
        );
        break;
      case "amountNetOfVat":
        label = formatToLocalCurrency((bookingData.totalAmount || 0) / 1.12);
        break;
      case "totalAmountDue":
        label = formatToLocalCurrency(bookingData.totalAmount);
        break;
      default:
        label = "";
    }

    return { ...f, label }; // new object with value
  });
};

// Mapping and filling the bookingData to the table object from the invoice template data
export const mapTableData = (table, bookingData) => {
  return bookingData.orders.map((o) => ({
    quantity: formatNumber(o.quantity),
    productName: o.product.productName,
    price: formatToLocalCurrency(o.price),
    amount: formatToLocalCurrency(o.price * o.quantity),
  }));
};
