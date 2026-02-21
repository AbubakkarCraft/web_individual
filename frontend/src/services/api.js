import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api',
});

export const signup = (userData) => api.post('/auth/signup', userData);
export const signin = (credentials) => api.post('/auth/signin', credentials);
export const forgotPassword = (email) => api.post('/auth/forgot-password', { email });

export default api;
