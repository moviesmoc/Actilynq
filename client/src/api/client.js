import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
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
