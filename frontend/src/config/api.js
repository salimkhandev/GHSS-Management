// API Configuration
// Automatically switches between development and production URLs based on environment

const apiBase =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_BACKEND_URL
    : import.meta.env.VITE_BACKEND_URL_PROD;

export default apiBase;
