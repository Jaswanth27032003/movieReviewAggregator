import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
    AppBar as MuiAppBar,
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
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    useTheme,
    alpha,
    styled,
    useMediaQuery,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Search as SearchIcon,
    AccountCircle,
    // Brightness4,
    // Brightness7,
    Movie,
    Tv,
    Whatshot,
    Star,
    Close,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
// import { useThemeContext } from '../../context/ThemeContext';

// Styled search component
const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
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
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

const AppBar: React.FC = () => {
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const { state, logout } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();
    // const { toggleColorMode } = useThemeContext();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navItems = [
        { text: 'Movies', icon: <Movie />, path: '/movies' },
        { text: 'TV Shows', icon: <Tv />, path: '/tv' },
    ];

    const drawer = (
        <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle}>
            <Box sx={{ display: 'flex', alignItems: 'center', p: 2, justifyContent: 'space-between' }}>
                <Typography variant="h6" component="div">
                    Menu
                </Typography>
                <IconButton onClick={handleDrawerToggle}>
                    <Close />
                </IconButton>
            </Box>
            <Divider />
            <List>
                {navItems.map((item) => (
                    <ListItem
                        key={item.text}
                        component={RouterLink}
                        to={item.path}
                        sx={{
                            color: 'text.primary',
                            '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            }
                        }}
                    >
                        <ListItemIcon sx={{ color: 'primary.main' }}>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {state.user ? (
                    <>

                        <ListItem
                            component={RouterLink}
                            to="/my-reviews"
                            sx={{
                                color: 'text.primary',
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                }
                            }}
                        >
                            {/* <ListItemIcon sx={{ color: 'primary.main' }}>
                                <Star />
                            </ListItemIcon>
                            <ListItemText primary="My Reviews" /> */}
                        </ListItem>
                        <ListItem
                            onClick={handleLogout}
                            sx={{
                                color: 'text.primary',
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                }
                            }}
                        >
                            <ListItemIcon sx={{ color: 'primary.main' }}>
                                <Close />
                            </ListItemIcon>
                            <ListItemText primary="Logout" />
                        </ListItem>
                    </>
                ) : (
                    <>
                        <ListItem
                            component={RouterLink}
                            to="/login"
                            sx={{
                                color: 'text.primary',
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                }
                            }}
                        >
                            <ListItemIcon sx={{ color: 'primary.main' }}>
                                <AccountCircle />
                            </ListItemIcon>
                            <ListItemText primary="Login" />
                        </ListItem>
                        <ListItem
                            component={RouterLink}
                            to="/register"
                            sx={{
                                color: 'text.primary',
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                }
                            }}
                        >
                            <ListItemIcon sx={{ color: 'primary.main' }}>
                                <AccountCircle />
                            </ListItemIcon>
                            <ListItemText primary="Register" />
                        </ListItem>
                    </>
                )}
            </List>
        </Box>
    );


    return (
        <>
            <MuiAppBar position="sticky" elevation={0}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        {/* Mobile menu icon */}
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { sm: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>

                        {/* Logo */}
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Movie sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                            <Typography
                                variant="h6"
                                noWrap
                                component={RouterLink}
                                to="/"
                                sx={{
                                    mr: 2,
                                    display: { xs: 'none', md: 'flex' },
                                    fontWeight: 700,
                                    color: 'inherit',
                                    textDecoration: 'none',
                                }}
                            >
                                MOVIEREVIEWS
                            </Typography>
                        </Box>

                        {/* Mobile logo */}
                        <Typography
                            variant="h6"
                            noWrap
                            component={RouterLink}
                            to="/"
                            sx={{
                                mr: 2,
                                display: { xs: 'flex', md: 'none' },
                                flexGrow: 1,
                                fontWeight: 700,
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            MR
                        </Typography>

                        {/* Desktop navigation */}
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            {navItems.map((item) => (
                                <Button
                                    key={item.text}
                                    component={RouterLink}
                                    to={item.path}
                                    sx={{ my: 2, color: 'white', display: 'block' }}
                                    startIcon={item.icon}
                                >
                                    {item.text}
                                </Button>
                            ))}
                        </Box>

                        {/* Search */}
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search…"
                                inputProps={{ 'aria-label': 'search' }}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={handleSearch}
                            />
                        </Search>

                        {/* Theme toggle */}
                        {/* 
                        <IconButton sx={{ ml: 1 }} onClick={toggleColorMode} color="inherit">
                            {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                        </IconButton>
                        */}

                        {/* Authentication buttons */}
                        <Box sx={{ flexGrow: 0, ml: 2 }}>
                            {state.user ? (
                                <>

                                    {/* <Button
                                        color="inherit"
                                        component={RouterLink}
                                        to="/my-reviews"
                                        sx={{ mr: 1 }}
                                    >
                                        My Reviews
                                    </Button> */}
                                    <Button
                                        variant="outlined"
                                        color="inherit"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        color="inherit"
                                        component={RouterLink}
                                        to="/login"
                                        sx={{ mr: 1 }}
                                    >
                                        Login
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="inherit"
                                        component={RouterLink}
                                        to="/register"
                                    >
                                        Register
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Toolbar>
                </Container>
            </MuiAppBar>

            {/* Mobile drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
                }}
            >
                {drawer}
            </Drawer>
        </>
    );
};

export default AppBar; 