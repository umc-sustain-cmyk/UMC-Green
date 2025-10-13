import api from '../utils/api';

// Auth API functions
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Update password
  updatePassword: async (passwordData) => {
    const response = await api.put('/auth/password', passwordData);
    return response.data;
  }
};

// User API functions
export const userAPI = {
  // Get user profile
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  // Get user by ID
  getUserById: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  }
};

// Item API functions
export const itemAPI = {
  // Get all items with filters
  getItems: async (params = {}) => {
    const response = await api.get('/items', { params });
    return response.data;
  },

  // Get single item by ID
  getItemById: async (itemId) => {
    const response = await api.get(`/items/${itemId}`);
    return response.data;
  },

  // Create new item
  createItem: async (itemData) => {
    const response = await api.post('/items', itemData);
    return response.data;
  },

  // Update item
  updateItem: async (itemId, itemData) => {
    const response = await api.put(`/items/${itemId}`, itemData);
    return response.data;
  },

  // Delete item
  deleteItem: async (itemId) => {
    const response = await api.delete(`/items/${itemId}`);
    return response.data;
  },

  // Get items by user
  getItemsByUser: async (userId, params = {}) => {
    const response = await api.get(`/items/user/${userId}`, { params });
    return response.data;
  }
};

// Health check
export const healthAPI = {
  check: async () => {
    const response = await api.get('/health');
    return response.data;
  }
};