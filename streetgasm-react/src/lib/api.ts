import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Config
export const getConfig = async () => {
  const response = await api.get('/config');
  return response.data;
};

// Stats
export const getStats = async () => {
  const response = await api.get('/stats');
  return response.data;
};

// Subscriptions
interface SubscriptionParams {
  page?: number;
  per_page?: number;
  status?: string;
}

export const getSubscriptions = async (params: SubscriptionParams = {}) => {
  const response = await api.get('/subscriptions', { params });
  return response.data;
};

export const getSubscription = async (id: number) => {
  const response = await api.get(`/subscriptions/${id}`);
  return response.data;
};

// Orders
interface OrderParams {
  page?: number;
  per_page?: number;
  status?: string;
}

export const getOrders = async (params: OrderParams = {}) => {
  const response = await api.get('/orders', { params });
  return response.data;
};

export const getOrder = async (id: number) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

// Products (Events)
interface ProductParams {
  page?: number;
  per_page?: number;
  category?: string;
}

export const getProducts = async (params: ProductParams = {}) => {
  const response = await api.get('/products', { params });
  return response.data;
};

export const getProduct = async (id: number) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

// Customers
interface CustomerParams {
  page?: number;
  per_page?: number;
  role?: string;
}

export const getCustomers = async (params: CustomerParams = {}) => {
  const response = await api.get('/customers', { params });
  return response.data;
};

export const getCustomer = async (id: number) => {
  const response = await api.get(`/customers/${id}`);
  return response.data;
};

// Reports
interface ReportParams {
  period?: string;
  date_min?: string;
  date_max?: string;
}

export const getSalesReport = async (params: ReportParams = {}) => {
  const response = await api.get('/reports/sales', { params });
  return response.data;
};

export const getTopSellers = async (params: ReportParams = {}) => {
  const response = await api.get('/reports/top_sellers/products', { params });
  return response.data;
};

// Coupons
export const getCoupons = async () => {
  const response = await api.get('/coupons');
  return response.data;
};

// Error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
);

export default api;
