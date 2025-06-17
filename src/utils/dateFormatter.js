// Format to date only
const formatDate = (date) =>
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));

// Format to date with local time
const formatDateWithTime = (date) =>
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Manila", // Optional: adjust as needed
  }).format(new Date(date));

// Format example "2025-06-16" to pass to an input as initial value
const formatDateForInput = (dateStr) => {
  const date = new Date(dateStr);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`; // example: "2025-06-16"
};

// Format input date to long date, example "2025-06-16" to "June 16, 2025"
const formatToLongDate = (dateStr) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

export { formatDate, formatDateWithTime, formatDateForInput, formatToLongDate };
