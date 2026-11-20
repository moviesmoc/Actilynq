import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach Bearer token fallback if present
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('actilynq_token');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // Ignore localStorage access restrictions in strict private mode
  }
  return config;
});

// Response interceptor to format errors nicely
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      status: error.response?.status,
      message: error.response?.data?.error || error.message || 'Something went wrong',
      details: error.response?.data?.details || null
    };
    return Promise.reject(customError);
  }
);

export default api;
