import React from 'react';
import { Box, Container, CssBaseline } from '@mui/material';
import AppBar from './AppBar';
import Footer from './Footer';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}
        >
            <CssBaseline />
            <AppBar />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: { xs: 2, md: 4 },
                    width: '100%',
                }}
            >
                <Container maxWidth="xl" sx={{ height: '100%' }}>
                    {children}
                </Container>
            </Box>
            <Footer />
        </Box>
    );
};

export default Layout; 