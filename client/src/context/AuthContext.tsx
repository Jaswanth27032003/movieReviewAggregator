import React, { createContext, useContext, useReducer, useEffect, useCallback, useState } from 'react';
import axios from 'axios';
import { User, AuthState } from '../types';

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
    isAuthenticated: !!localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    loading: true,
    error: null,
    authToken: localStorage.getItem('token'), // Initialize authToken from localStorage
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
                authToken: localStorage.getItem('token') || state.authToken, // Sync with localStorage
            };
        case 'LOGIN_SUCCESS':
        case 'REGISTER_SUCCESS':
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            console.log('Token saved to localStorage:', action.payload.token);
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
                loading: false,
                error: null,
                authToken: action.payload.token, // Update authToken in state
            };
        case 'LOGOUT':
        case 'AUTH_ERROR':
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            console.log('Token removed from localStorage');
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                loading: false,
                error: action.type === 'AUTH_ERROR' ? action.payload : null,
                authToken: null, // Clear authToken in state
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
    const [currentToken, setCurrentToken] = useState<string | null>(localStorage.getItem('token'));

    const setAuthToken = (token: string | null) => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            console.log('Set axios default Authorization header:', `Bearer ${token}`);
            setCurrentToken(token);
            // Use a default User object that matches the User type if state.user is null
            const defaultUser: User = {
                id: '',
                email: '',
                username: '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            dispatch({ type: 'LOGIN_SUCCESS', payload: { token, user: state.user || defaultUser } }); // Sync state
        } else {
            delete axios.defaults.headers.common['Authorization'];
            console.log('Removed axios default Authorization header');
            setCurrentToken(null);
            dispatch({ type: 'LOGOUT' }); // Sync state on token removal
        }
    };

    const loadUser = useCallback(async () => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        console.log('Loading user with token from localStorage:', token);

        if (token && user) {
            try {
                setAuthToken(token); // Set the token for axios
                const res = await axios.get('/api/auth/validate', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                dispatch({ type: 'USER_LOADED', payload: JSON.parse(user) }); // Use stored user data
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
            dispatch({ type: 'AUTH_ERROR', payload: 'No token found in localStorage. Please log in.' });
        }
    }, []); // Empty dependency array to run only on mount

    useEffect(() => {
        loadUser();
    }, [loadUser]); // Run loadUser when it changes (though it’s memoized)

    const login = async (email: string, password: string) => {
        try {
            console.log('Attempting login with:', { email: email.toLowerCase(), password });
            dispatch({ type: 'LOADING' });
            const res = await axios.post('/api/auth/login', { email: email.toLowerCase(), password });
            console.log('Login response received:', res.data); // Log full response
            if (!res.data.token || !res.data.user) {
                throw new Error('Invalid login response: token or user missing');
            }
            dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
            setAuthToken(res.data.token); // Set the token after successful login
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
            const res = await axios.post('/api/auth/register', {
                username,
                email: email.toLowerCase(),
                password,
            });
            console.log('Register response:', res.data);
            dispatch({ type: 'REGISTER_SUCCESS', payload: res.data });
            setAuthToken(res.data.token); // Set the token after successful registration
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
            const res = await axios.put('/api/users/profile', userData, {
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
        throw new Error('useAuth must be used within an AuthProvider. Make sure your component is wrapped with AuthProvider in the component tree.');
    }
    return context;
};