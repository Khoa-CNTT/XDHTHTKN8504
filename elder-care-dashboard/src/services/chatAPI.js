import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

const chatAPI = {
    // Get user's chats
    getMyChats: () => {
        return api.get('/chats/my-chats');
    },

    // Get chat details
    getChatDetail: (chatId) => {
        return api.get(`/chats/${chatId}`);
    },

    // Get chat messages with pagination
    getChatMessages: (chatId, params = {}) => {
        return api.get(`/chats/${chatId}/messages`, { params });
    },

    // Create new chat
    createChat: (chatData) => {
        return api.post('/chats', chatData);
    },

    // Send message
    sendMessage: (chatId, messageData) => {
        return api.post(`/chats/${chatId}/messages`, messageData);
    },

    // Mark messages as read
    markAsRead: (chatId, messageIds) => {
        return api.put(`/chats/${chatId}/read`, messageIds);
    },

    // Deactivate chat (admin only)
    deactivateChat: (chatId) => {
        return api.put(`/chats/${chatId}/deactivate`);
    },

    // Get available users for chat
    getAvailableUsers: (role = '') => {
        return api.get(`/chats/available-users/${role}`);
    }
};

export default chatAPI;