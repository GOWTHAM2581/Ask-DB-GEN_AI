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
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

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
