/**
 * Capitalizes each word in a string.
 * Example: "john doe" -> "John Doe"
 * Handles multiple spaces and trims extra whitespace.
 */
function capitalizeWords(text) {
  if (!text || typeof text !== "string") return "";
  return text
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Capitalizes only the first letter of the string.
 * Example: "john" -> "John"
 */
function capitalizeFirst(text) {
  if (!text || typeof text !== "string") return "";
  text = text.trim().toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Converts email to lowercase and trims spaces.
 */
function normalizeEmail(text) {
  if (!text || typeof text !== "string") return "";
  return text.trim().toLowerCase();
}

/**
 * Normalizes phone numbers (removes spaces, keeps digits only).
 * Example: "0719 123 271" -> "0719123271"
 */
function normalizePhone(text) {
  if (!text || typeof text !== "string") return "";
  return text.replace(/\D/g, "").trim();
}

module.exports = {
  capitalizeWords,
  capitalizeFirst,
  normalizeEmail,
  normalizePhone,
};
