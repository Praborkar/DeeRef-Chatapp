import axios from "axios";

// Create Axios instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
  withCredentials: true,   // ⭐ REQUIRED for credentialed requests
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`; // ⭐ MUST use exact case
    config.withCredentials = true;                       // ⭐ REQUIRED for DELETE + CORS
  }

  return config;
});

export default api;
