import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Link,
    Alert,
    CircularProgress
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useScroll } from '../context/ScrollContext';
const RegisterPage: React.FC = () => {
    let navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { state, register, clearError } = useAuth();
    const { scrollRef } = useScroll();
    // Redirect if already authenticated
    useEffect(() => {
        if (state.isAuthenticated) {
            navigate('/');
        }

        // Clear any existing errors when component mounts
        clearError();
    }, [state.isAuthenticated, navigate, clearError]);

    const validateForm = () => {
        let isValid = true;

        // Username validation
        if (!username) {
            setUsernameError('Username is required');
            isValid = false;
        } else if (username.length < 3) {
            setUsernameError('Username must be at least 3 characters');
            isValid = false;
        } else if (username.length > 20) {
            setUsernameError('Username must be less than 20 characters');
            isValid = false;
        } else {
            setUsernameError('');
        }

        // Email validation
        if (!email) {
            setEmailError('Email is required');
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError('Email is invalid');
            isValid = false;
        } else {
            setEmailError('');
        }

        // Password validation
        if (!password) {
            setPasswordError('Password is required');
            isValid = false;
        } else if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            isValid = false;
        } else {
            setPasswordError('');
        }

        // Confirm password validation
        if (!confirmPassword) {
            setConfirmPasswordError('Please confirm your password');
            isValid = false;
        } else if (password !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match');
            isValid = false;
        } else {
            setConfirmPasswordError('');
        }

        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            await register(username, email, password);
            navigate('/');
        } catch (error) {
            // Error is handled by the context
            console.error('Registration failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box ref={scrollRef} sx={{ overflowY: 'auto', height: '100vh', paddingBottom: 4 }}>
            <Container maxWidth="sm">
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography component="h1" variant="h4" align="center" gutterBottom>
                        Register
                    </Typography>

                    {state.error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {state.error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            error={!!usernameError}
                            helperText={usernameError}
                            disabled={isSubmitting}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={!!emailError}
                            helperText={emailError}
                            disabled={isSubmitting}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={!!passwordError}
                            helperText={passwordError}
                            disabled={isSubmitting}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            id="confirmPassword"
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            error={!!confirmPasswordError}
                            helperText={confirmPasswordError}
                            disabled={isSubmitting}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <CircularProgress size={24} /> : 'Register'}
                        </Button>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2">
                                Already have an account?{' '}
                                <Link component={RouterLink} to="/login" variant="body2">
                                    Login here
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default RegisterPage; 