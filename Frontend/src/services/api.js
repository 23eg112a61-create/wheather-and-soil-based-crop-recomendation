import axios from 'axios';

const getApiBaseUrl = () => {
  const hostname = window.location.hostname;
  
  // If running locally on localhost/loopback, use local port 5000
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]') {
    return 'http://localhost:5000/api';
  }

  // If accessing via local network IP (e.g. 192.168.x.x or 10.x.x.x or 172.x.x.x)
  const isLocalIp = /^192\.168\.\d+\.\d+$/.test(hostname) || 
                    /^10\.\d+\.\d+\.\d+$/.test(hostname) || 
                    /^172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+$/.test(hostname);
  if (isLocalIp) {
    return `http://${hostname}:5000/api`;
  }

  // Otherwise, use configured VITE_API_URL or fallback
  let envUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';
  
  envUrl = envUrl.trim();
  if (envUrl.endsWith('/')) {
    envUrl = envUrl.slice(0, -1);
  }
  if (!envUrl.endsWith('/api')) {
    envUrl = envUrl + '/api';
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
