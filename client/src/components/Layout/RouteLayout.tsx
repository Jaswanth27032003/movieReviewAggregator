// Create a new file called RootLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import AppBar from './AppBar';

const RootLayout: React.FC = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar />
            <Box component="main" sx={{ flexGrow: 1 }}>
                <Outlet /> {/* This is where your page content will render */}
            </Box>
            {/* <Footer /> */}
        </Box>
    );
};

export default RootLayout;