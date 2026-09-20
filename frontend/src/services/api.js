import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const registerCustomer = (data) => api.post('/customers/register', data);
export const loginCustomer = (data) => api.post('/customers/login', data);
export const getProfile = () => api.get('/customers/me');
export const logoutCustomer = () => api.post('/customers/logout');
export const changePassword = (data) => api.patch('/customers/change-password', data);

export const getProducts = (params) => api.get('/products', { params });
export const getProductById = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);

export default api;
