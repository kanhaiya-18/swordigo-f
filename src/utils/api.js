import axios from "axios";

// Use environment variable for API URL or fallback to Railway production URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://swordigo-back-production.up.railway.app";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const adminToken = localStorage.getItem("adminToken");
    
    // Use admin token if available, otherwise use regular token
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear it and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("adminToken");
      // Don't redirect if already on login page
      if (window.location.pathname !== "/login" && window.location.pathname !== "/admin/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

