import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('oepro_admin_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('oepro_admin_token');
            localStorage.removeItem('oepro_admin_auth');
            if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
                window.location.href = '/admin/login';
            }
        }
        return Promise.reject(error);
    }
);

export const fetchBanners = () => axiosInstance.get('/banners');
export const createBanner = (data) => axiosInstance.post('/admin/banners', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateBanner = (id, data) => axiosInstance.post(`/admin/banners/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteBanner = (id) => axiosInstance.delete(`/admin/banners/${id}`);
export const reorderBanners = (orderData) => axiosInstance.post('/admin/banners/reorder', orderData);

export const fetchCategories = () => axiosInstance.get('/categories');
export const createCategory = (data) => axiosInstance.post('/admin/categories', data);
export const updateCategory = (id, data) => axiosInstance.put(`/admin/categories/${id}`, data);
export const deleteCategory = (id) => axiosInstance.delete(`/admin/categories/${id}`);

export const fetchProducts = (params) => axiosInstance.get('/products', { params });
export const fetchProduct = (idOrSlug) => axiosInstance.get(`/products/${idOrSlug}`);
export const createProduct = (data) => axiosInstance.post('/admin/products', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateProduct = (id, data) => axiosInstance.post(`/admin/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteProduct = (id) => axiosInstance.delete(`/admin/products/${id}`);
export const addProductImage = (productId, formData) => axiosInstance.post(`/admin/products/${productId}/images`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const removeProductImage = (imageId) => axiosInstance.delete(`/admin/products/images/${imageId}`);

export const createOrder = (orderData) => axiosInstance.post('/orders', orderData);
export const fetchOrders = () => axiosInstance.get('/admin/orders');
export const updateOrderStatus = (id, status) => axiosInstance.put(`/admin/orders/${id}/status`, { status });

export const login = (credentials) => axiosInstance.post('/auth/login', credentials);
export const logout = () => axiosInstance.post('/auth/logout');
export const getMe = () => axiosInstance.get('/auth/me');

export const resolveImageUrl = (path) => {
    if (!path) return '/assets/brand/oepro-logo.webp';
    const imgUrl = typeof path === 'object' && path !== null ? path.url || path.image_url || '' : path;
    if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://') || imgUrl.startsWith('data:')) {
        return imgUrl;
    }
    const backendBase = import.meta.env.VITE_API_BASE_URL || window.location.origin;
    const storageBase = backendBase.replace(/\/api$/, '') + '/storage/';
    if (imgUrl.startsWith('storage/')) {
        return storageBase + imgUrl.replace('storage/', '');
    }
    if (imgUrl.startsWith('/storage/')) {
        return storageBase + imgUrl.replace('/storage/', '');
    }
    return imgUrl.startsWith('/') ? imgUrl : '/' + imgUrl;
};

export default axiosInstance;