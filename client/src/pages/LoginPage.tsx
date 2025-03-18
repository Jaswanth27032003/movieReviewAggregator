import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useScroll } from '../context/ScrollContext';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Link,
    Alert,
    CircularProgress,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { state, login, clearError } = useAuth();
    const navigate = useNavigate();
    const { scrollRef } = useScroll();

    // Redirect if already authenticated
    useEffect(() => {
        if (state.isAuthenticated) {
            navigate('/');
        }
        clearError(); // Clear any existing errors
    }, [state.isAuthenticated, navigate, clearError]);

    const validateForm = () => {
        let isValid = true;

        const emailLower = email.toLowerCase(); // Normalize email to lowercase
        if (!emailLower) {
            setEmailError('Email is required');
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(emailLower)) {
            setEmailError('Email is invalid');
            isValid = false;
        } else {
            setEmailError('');
        }

        if (!password) {
            setPasswordError('Password is required');
            isValid = false;
        } else if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            isValid = false;
        } else {
            setPasswordError('');
        }

        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const emailLower = email.toLowerCase(); // Send normalized email to backend
            console.log('Submitting login with:', { email: emailLower, password });
            await login(emailLower, password); // Pass normalized email to login function
            navigate('/');
        } catch (error: any) {
            console.error('Login submission error:', {
                message: error.message,
                response: error.response ? error.response.data : null,
            });
            // Error is already set in AuthContext, so we rely on state.error
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box ref={scrollRef} sx={{ overflowY: 'auto', height: '100vh', paddingBottom: 4 }}>
            <Container maxWidth="sm">
                <Box sx={{ my: 8 }}>
                    <Paper elevation={3} sx={{ p: 4 }}>
                        <Typography component="h1" variant="h4" align="center" gutterBottom>
                            Login
                        </Typography>

                        {(state.error || emailError || passwordError) && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {state.error || emailError || passwordError}
                            </Alert>
                        )}

                        <Box component="form" onSubmit={handleSubmit} noValidate>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
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
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                error={!!passwordError}
                                helperText={passwordError}
                                disabled={isSubmitting}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <CircularProgress size={24} /> : 'Login'}
                            </Button>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="body2">
                                    Don't have an account?{' '}
                                    <Link component={RouterLink} to="/register" variant="body2">
                                        Register here
                                    </Link>
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </Box>
    );
};

export default LoginPage;