// API configuration
// Move hardcoded values to environment variables for production
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://192.168.1.4:8080";

export default API_BASE_URL;