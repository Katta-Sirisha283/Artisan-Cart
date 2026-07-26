import client from './client';

// Products
export const getProducts = (params) => client.get('/api/products', { params });
export const getFeaturedProducts = () => client.get('/api/products/featured');
export const getProduct = (id) => client.get(`/api/products/${id}`);

// Auth
export const register = (data) => client.post('/api/auth/register', data);
export const login = (data) => client.post('/api/auth/login', data);

// Cart
export const getCart = () => client.get('/api/cart');
export const addToCart = (productId, quantity) => client.post('/api/cart', { productId, quantity });
export const removeFromCart = (cartItemId) => client.delete(`/api/cart/${cartItemId}`);
export const checkout = (shippingAddress) => client.post('/api/cart/checkout', { shippingAddress });

// Orders
export const getOrders = () => client.get('/api/orders');

// Chat
export const sendChatMessage = (message) => client.post('/api/chat', { message });
