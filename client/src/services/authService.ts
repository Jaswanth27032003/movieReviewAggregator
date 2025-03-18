import { api } from './api';
import { User } from '../types';

// Register user
export const register = async (username: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
};

// Login user
export const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
};

// Get current user
export const getCurrentUser = async () => {
    const response = await api.get('/auth/me');
    return response.data;
};

// Set token in local storage
export const setToken = (token: string) => {
    localStorage.setItem('token', token);
};

// Remove token from local storage
export const removeToken = () => {
    localStorage.removeItem('token');
};

// Check if user is authenticated
export const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
}; 