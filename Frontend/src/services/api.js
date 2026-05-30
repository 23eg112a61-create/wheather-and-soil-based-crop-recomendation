import axios from 'axios';

// Dynamically resolve API URL to support testing on mobile/other devices on the local network
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';
  const hostname = window.location.hostname;

  // If we are accessing the app via a local network IP address (e.g., 192.168.x.x)
  // rather than localhost, dynamically point the backend API call to that same network IP.
  if (hostname !== 'localhost' && hostname !== '127.0.0.1' && hostname !== '[::1]') {
    try {
      const url = new URL(envUrl);
      if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
        url.hostname = hostname;
        return url.toString();
      }
    } catch (e) {
      // Fallback in case URL parsing fails
    }
  }
  return envUrl;
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Securely transmit HttpOnly authentication cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
