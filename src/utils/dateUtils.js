/**
 * Converts a JavaScript Date object to a 'YYYY-MM-DD' string
 * based on its local date parts, ignoring timezone conversions.
 * This is crucial for sending dates to a backend that expects a specific calendar day.
 * @param {Date} date The date to convert.
 * @returns {string} The date formatted as 'YYYY-MM-DD'.
 */
export function toLocalISOString(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
