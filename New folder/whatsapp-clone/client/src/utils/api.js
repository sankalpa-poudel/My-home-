import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me')
};

export const userAPI = {
  getAllUsers: () => api.get('/users'),
  getUser: (id) => api.get(`/users/${id}`),
  updateProfile: (id, data) => api.put(`/users/${id}`, data),
  updateStatus: (id, data) => api.put(`/users/${id}/status`, data)
};

export const chatAPI = {
  getAllChats: () => api.get('/chats'),
  createOneToOneChat: (userId) => api.post('/chats/one-to-one', { userId }),
  createGroupChat: (data) => api.post('/chats/group', data),
  updateGroupChat: (chatId, data) => api.put(`/chats/${chatId}`, data),
  addUserToGroup: (chatId, userId) => api.post(`/chats/${chatId}/add-user`, { userId }),
  removeUserFromGroup: (chatId, userId) => api.post(`/chats/${chatId}/remove-user`, { userId })
};

export const messageAPI = {
  getMessages: (chatId, page = 1) => api.get(`/messages/${chatId}?page=${page}`),
  sendMessage: (data) => api.post('/messages', data),
  markAsRead: (messageId) => api.post(`/messages/${messageId}/read`),
  editMessage: (messageId, data) => api.put(`/messages/${messageId}`, data),
  deleteMessage: (messageId) => api.delete(`/messages/${messageId}`)
};

export default api;
