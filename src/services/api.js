import axios from 'axios';

const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const fetchBanners = () => axiosInstance.get('/banners');
export const fetchCategories = () => axiosInstance.get('/categories');
export const fetchProducts = () => axiosInstance.get('/products');
export const fetchOrders = () => axiosInstance.get('/admin/orders');

export const login = (credentials) => axiosInstance.post('/auth/login', credentials);
export const logout = () => axiosInstance.post('/auth/logout');
