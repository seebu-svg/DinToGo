import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Backend base URL for serving uploaded files (without /api prefix)
// In dev, VITE_API_URL is '/api' so BACKEND_BASE becomes '' — relative URLs work via proxy.
// In production, set VITE_API_URL to the full backend URL (e.g. https://api.example.com/api).
const BACKEND_BASE = import.meta.env.VITE_BACKEND_URL || API_BASE.replace(/\/api\/?$/, '') || '';

/**
 * Resolve a relative image URL to a full URL
 * Handles both relative paths (/uploads/...) and absolute URLs
 */
export const resolveImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  // If we have a backend base URL, prepend it for cross-origin images
  if (BACKEND_BASE && url.startsWith('/uploads/')) return `${BACKEND_BASE}${url}`;
  // Otherwise return as-is (works when same-origin or via Vite proxy)
  return url;
};

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Request interceptor — attach token from sessionStorage (per-tab isolation)
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('dintogo_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('dintogo_token');
      sessionStorage.removeItem('dintogo_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateMe: (data) => api.put('/auth/me', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// ── Dinners ───────────────────────────────────────
export const dinnersAPI = {
  getAll: (params) => api.get('/dinners', { params }),
  getById: (id) => api.get(`/dinners/${id}`),
  create: (data) => api.post('/dinners', data),
  update: (id, data) => api.put(`/dinners/${id}`, data),
  delete: (id) => api.delete(`/dinners/${id}`),
  join: (id, data) => api.post(`/dinners/${id}/join`, data),
  leave: (id) => api.post(`/dinners/${id}/leave`),
  myHostedDinners: () => api.get('/dinners/my/hosted'),
  myAttending: () => api.get('/dinners/my/attending'),
};

// ── Restaurants ───────────────────────────────────
export const restaurantsAPI = {
  getAll: (params) => api.get('/restaurants', { params }),
  getById: (id) => api.get(`/restaurants/${id}`),
  create: (data) => api.post('/restaurants', data),
  update: (id, data) => api.put(`/restaurants/${id}`, data),
  delete: (id) => api.delete(`/restaurants/${id}`),
  getMy: () => api.get('/restaurants/my/profile'),
  updateMy: (data) => api.put('/restaurants/my/profile', data),
  getCustomers: () => api.get('/restaurants/my/customers'),
};

// ── Reservations ──────────────────────────────────
export const reservationsAPI = {
  create: (data) => api.post('/reservations', data),
  getMy: () => api.get('/reservations/my'),
  getByRestaurant: (id, params) => api.get(`/reservations/restaurant/${id}`, { params }),
  updateStatus: (id, data) => api.put(`/reservations/${id}/status`, data),
  cancel: (id) => api.delete(`/reservations/${id}`),
};

// ── Offers ────────────────────────────────────────
export const offersAPI = {
  getAll: (params) => api.get('/offers', { params }),
  getById: (id) => api.get(`/offers/${id}`),
  create: (data) => api.post('/offers', data),
  update: (id, data) => api.put(`/offers/${id}`, data),
  delete: (id) => api.delete(`/offers/${id}`),
  getMy: () => api.get('/offers/my'),
};

// ── Reviews ───────────────────────────────────────
export const reviewsAPI = {
  getAll: (params) => api.get('/reviews', { params }),
  create: (data) => api.post('/reviews', data),
  toggleHelpful: (id) => api.post(`/reviews/${id}/helpful`),
  respond: (id, data) => api.post(`/reviews/${id}/respond`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
};

// ── Users ─────────────────────────────────────────
export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  follow: (id) => api.post(`/users/${id}/follow`),
  unfollow: (id) => api.post(`/users/${id}/unfollow`),
  getFollowers: (id) => api.get(`/users/${id}/followers`),
  getFollowing: (id) => api.get(`/users/${id}/following`),
  getInfluencers: (params) => api.get('/users/influencers', { params }),
};

// ── Chat ──────────────────────────────────────────
export const chatAPI = {
  getMyChats: () => api.get('/chat'),
  getById: (id) => api.get(`/chat/${id}`),
  sendMessage: (id, data) => api.post(`/chat/${id}/messages`, data),
  markRead: (id) => api.put(`/chat/${id}/read`),
};

// ── Notifications ─────────────────────────────────
export const notificationsAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/mark-all-read'),
};

// ── Collaborations ────────────────────────────────
export const collaborationsAPI = {
  getAll: (params) => api.get('/collaborations', { params }),
  create: (data) => api.post('/collaborations', data),
  update: (id, data) => api.put(`/collaborations/${id}`, data),
};

// ── Analytics ─────────────────────────────────────
export const analyticsAPI = {
  getRestaurant: (id) => api.get(`/analytics/restaurant/${id}`),
  getDashboard: () => api.get('/analytics/dashboard'),
};

// ── Uploads ───────────────────────────────────────
export const uploadsAPI = {
  uploadSingle: (formData) => api.post('/uploads/single', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  uploadMultiple: (formData) => api.post('/uploads/multiple', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  uploadAvatar: (formData) => api.post('/uploads/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  uploadCover: (formData) => api.post('/uploads/cover', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  uploadDinnerImages: (formData) => api.post('/uploads/dinner', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  uploadRestaurantImages: (formData) => api.post('/uploads/restaurant', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteImage: (url) => api.delete('/uploads', { data: { url } }),
};

export default api;
