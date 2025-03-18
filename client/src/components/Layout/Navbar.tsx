import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    Container,
    Avatar,
    Button,
    Tooltip,
    MenuItem,
    InputBase,
    useScrollTrigger,
    Slide,
    Badge,
    useTheme,
    useMediaQuery,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    CircularProgress,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import {
    Menu as MenuIcon,
    Search as SearchIcon,
    AccountCircle,
    Notifications as NotificationsIcon,
    Bookmark as BookmarkIcon,
    Movie as MovieIcon,
    Tv as TvIcon,
    Home as HomeIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

// Hide on scroll
interface HideOnScrollProps {
    children: React.ReactElement;
}

function HideOnScroll(props: HideOnScrollProps) {
    const { children } = props;
    const trigger = useScrollTrigger();

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}

// Styled components (unchanged)
const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius * 5,
    backgroundColor: alpha(theme.palette.common.white, 0.1),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.2),
        boxShadow: `0 0 10px ${alpha(theme.palette.primary.main, 0.3)}`,
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: alpha(theme.palette.common.white, 0.7),
    transition: 'color 0.3s ease',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
            '&:focus': {
                width: '30ch',
                boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
            },
        },
    },
}));

const LogoText = styled(Typography)(({ theme }) => ({
    fontWeight: 800,
    letterSpacing: '0.1rem',
    background: `linear-gradient(45deg, ${theme.palette.common.white}, ${theme.palette.secondary.light})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    '&:hover': {
        transform: 'scale(1.05)',
        letterSpacing: '0.12rem',
        background: `linear-gradient(45deg, ${theme.palette.common.white}, ${theme.palette.primary.light})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
})) as typeof Typography;

const UserAvatar = styled(Avatar)(({ theme }) => ({
    border: `2px solid ${alpha(theme.palette.common.white, 0.7)}`,
    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    '&:hover': {
        transform: 'scale(1.1) rotate(5deg)',
        border: `2px solid ${theme.palette.common.white}`,
        boxShadow: `0 0 15px ${alpha(theme.palette.primary.main, 0.5)}`,
    },
}));

const NavButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(0, 0.5),
    color: alpha(theme.palette.common.white, 0.8),
    fontWeight: 500,
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
    padding: theme.spacing(1, 2),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.1),
        color: theme.palette.common.white,
        transform: 'translateY(-2px)',
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: '50%',
        width: 0,
        height: 3,
        backgroundColor: theme.palette.primary.main,
        borderRadius: theme.shape.borderRadius,
        transition: 'all 0.3s ease',
        transform: 'translateX(-50%)',
    },
    '&:hover::before': {
        width: '50%',
    },
    '&.active': {
        color: theme.palette.common.white,
        fontWeight: 600,
        '&::before': {
            width: '50%',
        },
    },
    '&:disabled': {
        color: alpha(theme.palette.common.white, 0.4),
        pointerEvents: 'auto',
        '&:hover': {
            backgroundColor: 'transparent',
            transform: 'none',
            '&::before': {
                display: 'none',
            },
        },
    },
})) as typeof Button;

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    background: `linear-gradient(to right, ${alpha(theme.palette.primary.dark, 0.95)}, ${alpha(theme.palette.primary.main, 0.85)})`,
    boxShadow: 'none',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius,
    margin: theme.spacing(0.5, 1),
    transition: 'all 0.2s ease',
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        transform: 'translateX(5px)',
    },
}));

const NavIndicator = styled('div')(({ theme }) => ({
    position: 'absolute',
    height: 3,
    backgroundColor: theme.palette.secondary.main,
    borderRadius: theme.shape.borderRadius,
    bottom: 0,
    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
}));

const Navbar: React.FC = () => {
    const { state, logout } = useAuth();
    const { isAuthenticated, authToken, user } = state;
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
    const [watchlistCount, setWatchlistCount] = useState<number | null>(null);
    const [loadingCount, setLoadingCount] = useState(true); // Start with loading true
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // Debug authentication and navItems
    useEffect(() => {
        console.log('Navbar state:', { isAuthenticated, authToken: !!authToken, user });
    }, [isAuthenticated, authToken, user]);

    // Fetch watchlist count
    useEffect(() => {
        let isMounted = true;

        const fetchWatchlistCount = async () => {
            if (isAuthenticated && authToken) {
                setLoadingCount(true);
                try {
                    const response = await axios.get('/api/watchlist', {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        },
                    });
                    if (isMounted) {
                        const count = response.data.data?.length || 0;
                        setWatchlistCount(count);
                        console.log('Watchlist count fetched:', count);
                    }
                } catch (error) {
                    console.error('Error fetching watchlist count:', error);
                    if (isMounted) setWatchlistCount(0);
                } finally {
                    if (isMounted) {
                        setLoadingCount(false);
                        setIsInitialLoad(false); // Mark initial load complete
                    }
                }
            } else if (isMounted) {
                setWatchlistCount(0);
                setLoadingCount(false);
                setIsInitialLoad(false); // Mark initial load complete
            }
        };

        fetchWatchlistCount();

        return () => {
            isMounted = false;
        };
    }, [isAuthenticated, authToken]);

    // Update nav indicator position
    useEffect(() => {
        if (!isMobile) {
            const activeButton = document.querySelector('.active') as HTMLElement | null;
            if (activeButton) {
                const { left, width } = activeButton.getBoundingClientRect();
                const parentLeft = activeButton.parentElement?.getBoundingClientRect().left || 0;
                setIndicatorStyle({
                    left: left - parentLeft,
                    width: width,
                });
            }
        }
    }, [location.pathname, isMobile]);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
        setDrawerOpen(false);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchQuery.trim() !== '') {
            navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
        }
    };

    const handleLogout = () => {
        logout();
        handleCloseUserMenu();
        navigate('/');
    };

    const isActive = (path: string) => {
        return location.pathname === path ? 'active' : '';
    };

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }
        setDrawerOpen(open);
    };

    // Memoize navItems to prevent unnecessary re-renders
    const navItems = useMemo(() => [
        { text: 'Home', icon: <HomeIcon />, path: '/' },
        { text: 'Movies', icon: <MovieIcon />, path: '/movies' },
        { text: 'TV Shows', icon: <TvIcon />, path: '/tv' },
        {
            text: 'My Watchlist',
            icon: loadingCount ? (
                <CircularProgress size={20} color="inherit" />
            ) : (
                <Badge badgeContent={watchlistCount ?? 0} color="secondary" max={99}>
                    <BookmarkIcon />
                </Badge>
            ),
            path: '/watchlist',
            disabled: !isAuthenticated || loadingCount,
        },
    ], [isAuthenticated, loadingCount, watchlistCount]);

    // Log navItems to debug rendering
    useEffect(() => {
        console.log('Nav items:', navItems.map((item) => ({ text: item.text, disabled: item.disabled })));
    }, [navItems]);

    // Show loading state during initial load
    if (isInitialLoad) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '64px', background: alpha('#121212', 0.85) }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <HideOnScroll>
            <StyledAppBar
                position="fixed"
                sx={{
                    backgroundColor: isScrolled ? alpha('#121212', 0.85) : 'transparent',
                    boxShadow: isScrolled ? '0 4px 20px rgba(0, 0, 0, 0.15)' : 'none',
                    backdropFilter: isScrolled ? 'blur(10px)' : 'none',
                }}
                className={isScrolled ? 'scrolled' : ''}
            >
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{ py: 0.8 }}>
                        {/* Logo for larger screens */}
                        <MovieIcon
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                mr: 1,
                                color: theme.palette.secondary.main,
                                fontSize: '2rem',
                                filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.3))',
                            }}
                        />
                        <LogoText
                            variant="h5"
                            noWrap
                            to="/"
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: '"Inter", sans-serif',
                            }}
                            component={Link}
                        >
                            MOVIEREVIEWS
                        </LogoText>

                        {/* Mobile menu */}
                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="open navigation menu"
                                onClick={toggleDrawer(true)}
                                color="inherit"
                                sx={{
                                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                                    '&:hover': {
                                        backgroundColor: alpha(theme.palette.common.white, 0.2),
                                        transform: 'rotate(90deg)',
                                    },
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                <MenuIcon />
                            </IconButton>

                            {/* Mobile drawer navigation */}
                            <Drawer
                                anchor="left"
                                open={drawerOpen}
                                onClose={toggleDrawer(false)}
                                sx={{
                                    '& .MuiDrawer-paper': {
                                        width: 280,
                                        backgroundColor: alpha(theme.palette.background.paper, 0.95),
                                        backdropFilter: 'blur(10px)',
                                        boxShadow: '0 0 20px rgba(0,0,0,0.2)',
                                        borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                    },
                                }}
                            >
                                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <MovieIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                            MOVIEREVIEWS
                                        </Typography>
                                    </Box>
                                    <IconButton onClick={toggleDrawer(false)}>
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                                <Divider sx={{ mb: 2 }} />
                                <List>
                                    {navItems.map((item) => (
                                        <ListItem
                                            key={item.text}
                                            component={Link}
                                            to={item.path}
                                            onClick={handleCloseNavMenu}
                                            sx={{
                                                borderRadius: 2,
                                                mx: 1,
                                                mb: 1,
                                                backgroundColor: location.pathname === item.path
                                                    ? alpha(theme.palette.primary.main, 0.1)
                                                    : 'transparent',
                                                ...(item.disabled && {
                                                    opacity: 0.6,
                                                    pointerEvents: 'none',
                                                }),
                                                '&:hover': {
                                                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                                    transform: item.disabled ? 'none' : 'translateX(5px)',
                                                },
                                                transition: 'all 0.2s ease',
                                                cursor: item.disabled ? 'not-allowed' : 'pointer',
                                            }}
                                        >
                                            <ListItemIcon
                                                sx={{
                                                    color: location.pathname === item.path
                                                        ? theme.palette.primary.main
                                                        : item.disabled
                                                            ? alpha(theme.palette.text.primary, 0.6)
                                                            : theme.palette.text.primary,
                                                    minWidth: 40,
                                                }}
                                            >
                                                {item.icon}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={item.text}
                                                sx={{
                                                    '& .MuiTypography-root': {
                                                        fontWeight: location.pathname === item.path ? 600 : 400,
                                                        color: item.disabled
                                                            ? alpha(theme.palette.text.primary, 0.6)
                                                            : 'inherit',
                                                    },
                                                }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                                <Divider sx={{ my: 2 }} />
                                {!isAuthenticated && (
                                    <Box sx={{ px: 2, pb: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        <Button
                                            component={Link}
                                            to="/login"
                                            variant="outlined"
                                            fullWidth
                                            sx={{ borderRadius: 2 }}
                                        >
                                            Login
                                        </Button>
                                        <Button
                                            component={Link}
                                            to="/register"
                                            variant="contained"
                                            color="secondary"
                                            fullWidth
                                            sx={{ borderRadius: 2 }}
                                        >
                                            Sign Up
                                        </Button>
                                    </Box>
                                )}
                            </Drawer>
                        </Box>

                        {/* Logo for mobile screens */}
                        <MovieIcon
                            sx={{
                                display: { xs: 'flex', md: 'none' },
                                mr: 1,
                                color: theme.palette.secondary.main,
                                filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.3))',
                            }}
                        />
                        <LogoText
                            variant="h6"
                            noWrap
                            to="/"
                            sx={{
                                mr: 2,
                                display: { xs: 'flex', md: 'none' },
                                flexGrow: 1,
                                fontFamily: '"Inter", sans-serif',
                                fontSize: '1.2rem',
                            }}
                            component={Link}
                        >
                            MOVIEREVIEWS
                        </LogoText>

                        {/* Desktop menu */}
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, position: 'relative', alignItems: 'center' }}>
                            {navItems.map((item) => (
                                <NavButton
                                    key={item.text}
                                    to={item.path}
                                    onClick={handleCloseNavMenu}
                                    className={isActive(item.path)}
                                    startIcon={item.icon}
                                    component={Link}
                                    disabled={item.disabled}
                                    sx={{
                                        ...(item.disabled && {
                                            color: alpha(theme.palette.common.white, 0.4),
                                            pointerEvents: 'auto',
                                            '&:hover': {
                                                backgroundColor: 'transparent',
                                                transform: 'none',
                                            },
                                            '&::before': {
                                                display: 'none',
                                            },
                                        }),
                                    }}
                                >
                                    <Tooltip title={item.disabled ? 'Please log in to access your watchlist' : item.text}>
                                        <span>{item.text}</span>
                                    </Tooltip>
                                </NavButton>
                            ))}
                            {!isMobile && <NavIndicator style={{ left: `${indicatorStyle.left}px`, width: `${indicatorStyle.width}px` }} />}
                        </Box>

                        {/* Search bar */}
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search movies, TV shows..."
                                inputProps={{ 'aria-label': 'search' }}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearch}
                            />
                        </Search>

                        {/* User menu */}
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {isAuthenticated ? (
                                <>
                                    <IconButton
                                        size="large"
                                        color="inherit"
                                        sx={{
                                            ml: 1,
                                            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                            '&:hover': {
                                                transform: 'translateY(-2px) scale(1.1)',
                                                backgroundColor: alpha(theme.palette.common.white, 0.1),
                                            },
                                        }}
                                    >
                                        <Badge
                                            badgeContent={4}
                                            color="secondary"
                                            sx={{
                                                '& .MuiBadge-badge': {
                                                    boxShadow: '0 0 0 2px rgba(0,0,0,0.2)',
                                                    fontWeight: 'bold',
                                                },
                                            }}
                                        >
                                            <NotificationsIcon />
                                        </Badge>
                                    </IconButton>
                                    <Tooltip title="Open profile menu">
                                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 1 }}>
                                            <UserAvatar alt={user?.username || 'User'} src={user?.avatar || ''}>
                                                <AccountCircle />
                                            </UserAvatar>
                                        </IconButton>
                                    </Tooltip>
                                    <Menu
                                        sx={{
                                            mt: '45px',
                                            '& .MuiPaper-root': {
                                                backgroundColor: alpha(theme.palette.background.paper, 0.95),
                                                backdropFilter: 'blur(10px)',
                                                borderRadius: 2,
                                                minWidth: 200,
                                                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                                                overflow: 'visible',
                                                '&::before': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    top: -6,
                                                    right: 14,
                                                    width: 12,
                                                    height: 12,
                                                    backgroundColor: alpha(theme.palette.background.paper, 0.95),
                                                    transform: 'rotate(45deg)',
                                                    zIndex: 0,
                                                },
                                            },
                                        }}
                                        id="menu-appbar"
                                        anchorEl={anchorElUser}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        open={Boolean(anchorElUser)}
                                        onClose={handleCloseUserMenu}
                                    >
                                        {user && (
                                            <Box
                                                sx={{
                                                    px: 2,
                                                    py: 1,
                                                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                                }}
                                            >
                                                <Typography variant="subtitle1" fontWeight={600}>
                                                    {user.username}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {user.email}
                                                </Typography>
                                            </Box>
                                        )}
                                        <StyledMenuItem
                                            onClick={() => {
                                                handleCloseUserMenu();
                                                navigate('/watchlist');
                                            }}
                                        >
                                            <ListItemIcon>
                                                <Badge badgeContent={watchlistCount ?? 0} color="secondary">
                                                    <BookmarkIcon fontSize="small" />
                                                </Badge>
                                            </ListItemIcon>
                                            <Typography>My Watchlist</Typography>
                                        </StyledMenuItem>
                                        <Divider sx={{ my: 1 }} />
                                        <StyledMenuItem onClick={handleLogout}>
                                            <Typography color="error">Logout</Typography>
                                        </StyledMenuItem>
                                    </Menu>
                                </>
                            ) : (
                                <>
                                    <Button
                                        component={Link}
                                        to="/login"
                                        variant="text"
                                        sx={{
                                            color: 'white',
                                            mr: 1,
                                            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                backgroundColor: alpha(theme.palette.common.white, 0.1),
                                            },
                                        }}
                                    >
                                        Login
                                    </Button>
                                    <Button
                                        component={Link}
                                        to="/register"
                                        variant="contained"
                                        color="secondary"
                                        sx={{
                                            borderRadius: 2,
                                            fontWeight: 600,
                                            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                            },
                                        }}
                                    >
                                        Sign Up
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Toolbar>
                </Container>
            </StyledAppBar>
        </HideOnScroll>
    );
};

export default Navbar;