import axios from 'axios';

// Create Axios instance pointing to backend server
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Auto-inject JWT token header
API.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    const { token } = JSON.parse(storedUser);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;
