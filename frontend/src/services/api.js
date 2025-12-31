import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add auth token
api.interceptors.request.use((config) => {
    // We will now pass the token through the app's state management
    return config;
});

export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

export const login = async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
};

export const connectDB = async (connectionDetails) => {
    const response = await api.post('/db/connect', connectionDetails);
    return response.data;
};

export const askDatabase = async (db_token, prompt) => {
    const response = await api.post('/query/ask', { db_token, prompt });
    return response.data;
};

export default api;
