import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, PaletteMode } from '@mui/material';
import { createAppTheme } from '../theme';

type ThemeContextType = {
    mode: PaletteMode;
    toggleColorMode: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
    mode: 'dark',
    toggleColorMode: () => { },
});

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Get the user's preferred color scheme from localStorage or system preference
    const getInitialMode = (): PaletteMode => {
        const savedMode = localStorage.getItem('themeMode') as PaletteMode | null;
        if (savedMode) {
            return savedMode;
        }

        // Check system preference
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefersDarkMode ? 'dark' : 'light';
    };

    const [mode, setMode] = useState<PaletteMode>(getInitialMode);

    // Update localStorage when mode changes
    useEffect(() => {
        localStorage.setItem('themeMode', mode);
    }, [mode]);

    // Toggle between light and dark mode
    const toggleColorMode = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    // Create the theme
    const theme = useMemo(() => createAppTheme(mode), [mode]);

    // Context value
    const contextValue = useMemo(
        () => ({
            mode,
            toggleColorMode,
        }),
        [mode]
    );

    return (
        <ThemeContext.Provider value={contextValue}>
            <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
        </ThemeContext.Provider>
    );
}; 