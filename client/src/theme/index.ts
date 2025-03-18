import { createTheme, responsiveFontSizes, alpha } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

// Define color palette - Enhanced with more vibrant and modern colors
const primaryLight = '#FF4D4D'; // Vibrant red for primary actions
const primaryDark = '#FF6B6B'; // Slightly lighter red for dark mode
const secondaryLight = '#4ECDC4'; // Teal for secondary elements
const secondaryDark = '#5EFFE9'; // Brighter teal for dark mode
const accentLight = '#FFD166'; // Warm yellow accent
const accentDark = '#FFE066'; // Brighter yellow for dark mode
const tertiaryLight = '#6A7FDB'; // Purple-blue tertiary color
const tertiaryDark = '#8A9FFF'; // Brighter purple-blue for dark mode

// Background colors
const backgroundLight = '#FFFFFF'; // White background for light mode
const backgroundDark = '#121212'; // Dark background for dark mode
const surfaceLight = '#F8F9FA'; // Light gray surface for light mode
const surfaceDark = '#1E1E1E'; // Darker gray surface for dark mode

// Text colors
const textPrimaryLight = '#212121'; // Near black for primary text in light mode
const textPrimaryDark = '#FFFFFF'; // White for primary text in dark mode
const textSecondaryLight = '#757575'; // Medium gray for secondary text in light mode
const textSecondaryDark = '#BBBBBB'; // Light gray for secondary text in dark mode

// Status colors
const errorLight = '#FF5252'; // Red for errors in light mode
const errorDark = '#FF6E6E'; // Lighter red for errors in dark mode
const warningLight = '#FFB74D'; // Orange for warnings
const warningDark = '#FFC77D'; // Lighter orange for dark mode
const successLight = '#66BB6A'; // Green for success
const successDark = '#7ECC82'; // Lighter green for dark mode
const infoLight = '#42A5F5'; // Blue for info
const infoDark = '#64B5F6'; // Lighter blue for dark mode

// Create a theme instance for the specified mode
export const createAppTheme = (mode: PaletteMode) => {
    const isDark = mode === 'dark';

    let theme = createTheme({
        palette: {
            mode,
            primary: {
                main: isDark ? primaryDark : primaryLight,
                light: isDark ? alpha(primaryDark, 0.8) : alpha(primaryLight, 0.8),
                dark: isDark ? alpha(primaryDark, 1.2) : alpha(primaryLight, 1.2),
                contrastText: '#FFFFFF',
            },
            secondary: {
                main: isDark ? secondaryDark : secondaryLight,
                light: isDark ? alpha(secondaryDark, 0.8) : alpha(secondaryLight, 0.8),
                dark: isDark ? alpha(secondaryDark, 1.2) : alpha(secondaryLight, 1.2),
                contrastText: isDark ? '#000000' : '#FFFFFF',
            },
            background: {
                default: isDark ? backgroundDark : backgroundLight,
                paper: isDark ? surfaceDark : surfaceLight,
            },
            text: {
                primary: isDark ? textPrimaryDark : textPrimaryLight,
                secondary: isDark ? textSecondaryDark : textSecondaryLight,
            },
            error: {
                main: isDark ? errorDark : errorLight,
            },
            warning: {
                main: isDark ? warningDark : warningLight,
            },
            success: {
                main: isDark ? successDark : successLight,
            },
            info: {
                main: isDark ? infoDark : infoLight,
            },
            divider: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
        },
        typography: {
            fontFamily: [
                'Inter',
                'Roboto',
                '"Helvetica Neue"',
                'Arial',
                'sans-serif',
            ].join(','),
            h1: {
                fontWeight: 800,
                fontSize: '3.5rem',
                lineHeight: 1.2,
                letterSpacing: '-0.01562em',
            },
            h2: {
                fontWeight: 700,
                fontSize: '2.75rem',
                lineHeight: 1.2,
                letterSpacing: '-0.00833em',
            },
            h3: {
                fontWeight: 700,
                fontSize: '2.25rem',
                lineHeight: 1.2,
                letterSpacing: '0em',
            },
            h4: {
                fontWeight: 600,
                fontSize: '1.75rem',
                lineHeight: 1.2,
                letterSpacing: '0.00735em',
            },
            h5: {
                fontWeight: 600,
                fontSize: '1.5rem',
                lineHeight: 1.2,
                letterSpacing: '0em',
            },
            h6: {
                fontWeight: 600,
                fontSize: '1.25rem',
                lineHeight: 1.2,
                letterSpacing: '0.0075em',
            },
            subtitle1: {
                fontWeight: 500,
                fontSize: '1rem',
                lineHeight: 1.5,
                letterSpacing: '0.00938em',
            },
            subtitle2: {
                fontWeight: 500,
                fontSize: '0.875rem',
                lineHeight: 1.5,
                letterSpacing: '0.00714em',
            },
            body1: {
                fontWeight: 400,
                fontSize: '1rem',
                lineHeight: 1.5,
                letterSpacing: '0.00938em',
            },
            body2: {
                fontWeight: 400,
                fontSize: '0.875rem',
                lineHeight: 1.5,
                letterSpacing: '0.01071em',
            },
            button: {
                fontWeight: 600,
                fontSize: '0.875rem',
                lineHeight: 1.75,
                letterSpacing: '0.02857em',
                textTransform: 'none',
            },
            caption: {
                fontWeight: 400,
                fontSize: '0.75rem',
                lineHeight: 1.66,
                letterSpacing: '0.03333em',
            },
            overline: {
                fontWeight: 500,
                fontSize: '0.625rem',
                lineHeight: 2.66,
                letterSpacing: '0.08333em',
                textTransform: 'uppercase',
            },
        },
        shape: {
            borderRadius: 12,
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: `
                    body {
                        scrollbar-width: thin;
                    }
                    body::-webkit-scrollbar {
                        width: 8px;
                        height: 8px;
                    }
                    body::-webkit-scrollbar-track {
                        background: ${isDark ? alpha('#ffffff', 0.05) : alpha('#000000', 0.05)};
                        border-radius: 4px;
                    }
                    body::-webkit-scrollbar-thumb {
                        background: ${isDark ? alpha('#ffffff', 0.2) : alpha('#000000', 0.2)};
                        border-radius: 4px;
                    }
                    body::-webkit-scrollbar-thumb:hover {
                        background: ${isDark ? alpha('#ffffff', 0.3) : alpha('#000000', 0.3)};
                    }
                    
                    /* Custom gradient button class */
                    .gradient-button {
                        background: linear-gradient(45deg, ${primaryLight}, ${secondaryLight});
                        color: #FFFFFF;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                    }
                    .gradient-button:hover {
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                        transform: translateY(-2px);
                    }
                `,
            },
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        boxShadow: 'none',
                        backdropFilter: 'blur(10px)',
                        backgroundColor: isDark
                            ? alpha(backgroundDark, 0.8)
                            : alpha(backgroundLight, 0.8),
                        borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 12,
                        textTransform: 'none',
                        fontWeight: 600,
                        padding: '10px 20px',
                        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                    },
                    contained: {
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                        '&:hover': {
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                            transform: 'translateY(-2px)',
                        },
                    },
                    outlined: {
                        borderWidth: 2,
                        '&:hover': {
                            borderWidth: 2,
                            transform: 'translateY(-2px)',
                        },
                    },
                    text: {
                        '&:hover': {
                            transform: 'translateY(-2px)',
                        },
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 16,
                        boxShadow: isDark
                            ? '0px 4px 20px rgba(0, 0, 0, 0.4)'
                            : '0px 4px 20px rgba(0, 0, 0, 0.08)',
                        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                        overflow: 'hidden',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: isDark
                                ? '0px 8px 30px rgba(0, 0, 0, 0.6)'
                                : '0px 8px 30px rgba(0, 0, 0, 0.12)',
                        },
                    },
                },
            },
            MuiChip: {
                styleOverrides: {
                    root: {
                        borderRadius: 20,
                        fontWeight: 500,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                        },
                    },
                    filled: {
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundImage: 'none',
                        borderRadius: 16,
                    },
                    elevation1: {
                        boxShadow: isDark
                            ? '0px 2px 8px rgba(0, 0, 0, 0.3)'
                            : '0px 2px 8px rgba(0, 0, 0, 0.08)',
                    },
                    elevation2: {
                        boxShadow: isDark
                            ? '0px 3px 12px rgba(0, 0, 0, 0.35)'
                            : '0px 3px 12px rgba(0, 0, 0, 0.1)',
                    },
                },
            },
            MuiTextField: {
                styleOverrides: {
                    root: {
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 12,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                            },
                            '&.Mui-focused': {
                                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                            },
                        },
                    },
                },
            },
            MuiRating: {
                styleOverrides: {
                    root: {
                        color: isDark ? primaryDark : primaryLight,
                    },
                },
            },
            MuiDivider: {
                styleOverrides: {
                    root: {
                        margin: '24px 0',
                        opacity: isDark ? 0.2 : 0.1,
                    },
                },
            },
            MuiAvatar: {
                styleOverrides: {
                    root: {
                        border: isDark
                            ? `2px solid ${alpha(primaryDark, 0.5)}`
                            : `2px solid ${alpha(primaryLight, 0.5)}`,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            transform: 'scale(1.05)',
                            boxShadow: '0 3px 10px rgba(0, 0, 0, 0.15)',
                        },
                    },
                },
            },
            MuiListItem: {
                styleOverrides: {
                    root: {
                        borderRadius: 12,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            backgroundColor: isDark
                                ? alpha(surfaceDark, 0.6)
                                : alpha(surfaceLight, 0.6),
                            transform: 'translateX(4px)',
                        },
                    },
                },
            },
            MuiMenu: {
                styleOverrides: {
                    paper: {
                        borderRadius: 12,
                        boxShadow: isDark
                            ? '0 8px 24px rgba(0, 0, 0, 0.4)'
                            : '0 8px 24px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(8px)',
                        backgroundColor: isDark
                            ? alpha(surfaceDark, 0.9)
                            : alpha(surfaceLight, 0.9),
                    },
                },
            },
            MuiMenuItem: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        margin: '4px 8px',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            backgroundColor: isDark
                                ? alpha(primaryDark, 0.15)
                                : alpha(primaryLight, 0.08),
                        },
                    },
                },
            },
            MuiTooltip: {
                styleOverrides: {
                    tooltip: {
                        borderRadius: 8,
                        backgroundColor: isDark
                            ? alpha(surfaceDark, 0.9)
                            : alpha(surfaceLight, 0.9),
                        color: isDark ? textPrimaryDark : textPrimaryLight,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(4px)',
                        fontSize: '0.75rem',
                        padding: '8px 12px',
                    },
                },
            },
            MuiBackdrop: {
                styleOverrides: {
                    root: {
                        backgroundColor: isDark
                            ? alpha('#000000', 0.7)
                            : alpha('#000000', 0.5),
                        backdropFilter: 'blur(4px)',
                    },
                },
            },
            MuiDialog: {
                styleOverrides: {
                    paper: {
                        borderRadius: 16,
                        boxShadow: isDark
                            ? '0 12px 40px rgba(0, 0, 0, 0.5)'
                            : '0 12px 40px rgba(0, 0, 0, 0.15)',
                        backdropFilter: 'blur(8px)',
                    },
                },
            },
            MuiIconButton: {
                styleOverrides: {
                    root: {
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            transform: 'scale(1.1)',
                            backgroundColor: isDark
                                ? alpha(primaryDark, 0.15)
                                : alpha(primaryLight, 0.08),
                        },
                    },
                },
            },
            MuiLink: {
                styleOverrides: {
                    root: {
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                        position: 'relative',
                        '&:hover': {
                            color: isDark ? primaryDark : primaryLight,
                        },
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            width: '0%',
                            height: '2px',
                            bottom: '-2px',
                            left: '0',
                            backgroundColor: isDark ? primaryDark : primaryLight,
                            transition: 'width 0.3s ease',
                        },
                        '&:hover::after': {
                            width: '100%',
                        },
                    },
                },
            },
            MuiBadge: {
                styleOverrides: {
                    badge: {
                        fontWeight: 600,
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                    },
                },
            },
        },
    });

    // Make typography responsive
    theme = responsiveFontSizes(theme);

    return theme;
};

export default createAppTheme; 