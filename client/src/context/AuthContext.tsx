import React, { createContext, useContext, useReducer, useEffect, useCallback, useState } from 'react';
import axios from 'axios';
import { User, AuthState } from '../types';

// Define the backend URL using an environment variable
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'; // Fallback to localhost for development

// Define action types
type AuthAction =
    | { type: 'LOGIN_SUCCESS'; payload: { token: string; user: User } }
    | { type: 'REGISTER_SUCCESS'; payload: { token: string; user: User } }
    | { type: 'LOGOUT' }
    | { type: 'AUTH_ERROR'; payload: string }
    | { type: 'CLEAR_ERROR' }
    | { type: 'LOADING' }
    | { type: 'USER_LOADED'; payload: User };

// Initial state
const initialState: AuthState = {
    isAuthenticated: false, // Default to false until validated
    user: (() => {
        const userData = localStorage.getItem('user');
        console.log('userData from localStorage:', userData);
        if (userData && userData !== 'undefined' && userData !== '"undefined"') {
            try {
                const parsedUser = JSON.parse(userData);
                if (parsedUser && typeof parsedUser === 'object' && 'id' in parsedUser) {
                    return parsedUser as User;
                }
                console.warn('Parsed user data is not a valid User object:', parsedUser);
                localStorage.removeItem('user');
                return null;
            } catch (error) {
                console.error('Failed to parse user data from localStorage:', error);
                localStorage.removeItem('user');
                return null;
            }
        }
        console.log('No valid user data found in localStorage, clearing user key');
        localStorage.removeItem('user');
        return null;
    })(),
    loading: true,
    error: null,
    authToken: (() => {
        const token = localStorage.getItem('token');
        if (token && token !== 'undefined' && token !== '"undefined"') {
            return token;
        }
        console.log('No valid token found in localStorage, clearing token key');
        localStorage.removeItem('token');
        return null;
    })(),
};

// Create context
interface AuthContextType {
    state: AuthState;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    clearError: () => void;
    updateProfile: (userData: Partial<User>) => Promise<void>;
    setAuthToken: (token: string | null) => void;
}

const defaultContextValue: AuthContextType = {
    state: initialState,
    login: async () => { throw new Error('AuthContext not initialized'); },
    register: async () => { throw new Error('AuthContext not initialized'); },
    logout: () => { throw new Error('AuthContext not initialized'); },
    clearError: () => { throw new Error('AuthContext not initialized'); },
    updateProfile: async () => { throw new Error('AuthContext not initialized'); },
    setAuthToken: () => { throw new Error('AuthContext not initialized'); },
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

// Reducer function
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'USER_LOADED':
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload,
                loading: false,
                authToken: localStorage.getItem('token') || state.authToken,
            };
        case 'LOGIN_SUCCESS':
        case 'REGISTER_SUCCESS':
            // Validate token and user before storing
            if (!action.payload.token || typeof action.payload.token !== 'string') {
                console.error('Invalid token in LOGIN_SUCCESS/REGISTER_SUCCESS:', action.payload.token);
                return {
                    ...state,
                    loading: false,
                    error: 'Invalid token received from server',
                };
            }
            if (!action.payload.user || typeof action.payload.user !== 'object' || !('id' in action.payload.user)) {
                console.error('Invalid user data in LOGIN_SUCCESS/REGISTER_SUCCESS:', action.payload.user);
                return {
                    ...state,
                    loading: false,
                    error: 'Invalid user data received from server',
                };
            }
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            console.log('Token saved to localStorage:', action.payload.token);
            console.log('User data saved to localStorage:', action.payload.user);
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
                loading: false,
                error: null,
                authToken: action.payload.token,
            };
        case 'LOGOUT':
        case 'AUTH_ERROR':
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            console.log('Token and user data removed from localStorage');
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                loading: false,
                error: action.type === 'AUTH_ERROR' ? action.payload : null,
                authToken: null,
            };
        case 'LOADING':
            return {
                ...state,
                loading: true,
            };
        case 'CLEAR_ERROR':
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const [currentToken, setCurrentToken] = useState<string | null>(localStorage.getItem('token') || null);

    const setAuthToken = (token: string | null) => {
        if (token && typeof token === 'string') {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            console.log('Set axios default Authorization header:', `Bearer ${token}`);
            setCurrentToken(token);
            const defaultUser: User = {
                id: '',
                email: '',
                username: '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            dispatch({ type: 'LOGIN_SUCCESS', payload: { token, user: state.user || defaultUser } });
        } else {
            delete axios.defaults.headers.common['Authorization'];
            console.log('Removed axios default Authorization header');
            setCurrentToken(null);
            dispatch({ type: 'LOGOUT' });
        }
    };

    const loadUser = useCallback(async () => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        console.log('Loading user with token from localStorage:', token);

        if (token && user && token !== 'undefined' && token !== '"undefined"' && user !== 'undefined' && user !== '"undefined"') {
            try {
                const parsedUser = JSON.parse(user);
                if (!parsedUser || typeof parsedUser !== 'object' || !('id' in parsedUser)) {
                    throw new Error('Invalid user data in localStorage');
                }
                setAuthToken(token);
                const res = await axios.get(`${API_URL}/api/auth/validate`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                dispatch({ type: 'USER_LOADED', payload: parsedUser });
                console.log('Token validated, user loaded:', res.data);
            } catch (err: any) {
                console.error('Token validation failed:', {
                    message: err.response?.data?.message || err.message,
                    status: err.response?.status,
                    data: err.response?.data,
                });
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setCurrentToken(null);
                dispatch({ type: 'AUTH_ERROR', payload: 'Invalid or expired token. Please log in again.' });
            }
        } else {
            console.log('No valid token or user data found in localStorage');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            dispatch({ type: 'AUTH_ERROR', payload: 'No valid token or user data found. Please log in.' });
        }
    }, []);

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    const login = async (email: string, password: string) => {
        try {
            console.log('Attempting login with:', { email: email.toLowerCase(), password });
            dispatch({ type: 'LOADING' });
            const res = await axios.post(`${API_URL}/api/auth/login`, { email: email.toLowerCase(), password });
            console.log('Login response received:', res.data);
            if (!res.data || !res.data.token || !res.data.user) {
                throw new Error('Invalid login response: token or user missing');
            }
            if (typeof res.data.token !== 'string') {
                throw new Error('Invalid token format in login response');
            }
            if (typeof res.data.user !== 'object' || !('id' in res.data.user)) {
                throw new Error('Invalid user format in login response');
            }
            dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
            setAuthToken(res.data.token);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Login failed. Please try again.';
            console.error('Login error details:', {
                message: errorMessage,
                status: err.response?.status,
                data: err.response?.data,
                stack: err.stack,
            });
            dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
            throw new Error(errorMessage);
        }
    };

    const register = async (username: string, email: string, password: string) => {
        try {
            dispatch({ type: 'LOADING' });
            const res = await axios.post(`${API_URL}/api/auth/register`, {
                username,
                email: email.toLowerCase(),
                password,
            });
            console.log('Register response:', res.data);
            if (!res.data || !res.data.token || !res.data.user) {
                throw new Error('Invalid register response: token or user missing');
            }
            if (typeof res.data.token !== 'string') {
                throw new Error('Invalid token format in register response');
            }
            if (typeof res.data.user !== 'object' || !('id' in res.data.user)) {
                throw new Error('Invalid user format in register response');
            }
            dispatch({ type: 'REGISTER_SUCCESS', payload: res.data });
            setAuthToken(res.data.token);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
            console.error('Register error:', {
                message: errorMessage,
                status: err.response?.status,
                data: err.response?.data,
            });
            dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
            throw new Error(errorMessage);
        }
    };

    const logout = () => {
        setAuthToken(null);
        dispatch({ type: 'LOGOUT' });
    };

    const clearError = useCallback(() => {
        dispatch({ type: 'CLEAR_ERROR' });
    }, []);

    const updateProfile = async (userData: Partial<User>) => {
        try {
            dispatch({ type: 'LOADING' });
            const res = await axios.put(`${API_URL}/api/users/profile`, userData, {
                headers: { Authorization: `Bearer ${state.authToken}` },
            });
            dispatch({ type: 'USER_LOADED', payload: res.data });
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Profile update failed. Please try again.';
            dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
            throw new Error(errorMessage);
        }
    };

    return (
        <AuthContext.Provider value={{ state, login, register, logout, clearError, updateProfile, setAuthToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === defaultContextValue) {
        throw new Error('useAuth must be used within an AuthProvider.');
    }
    return context;
};
