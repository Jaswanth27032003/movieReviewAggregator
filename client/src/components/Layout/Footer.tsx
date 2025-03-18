import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Link,
    Grid,
    Divider,
    IconButton,
    useTheme,
    alpha,
    Button,
    TextField,
    Paper,
    Stack,
} from '@mui/material';
import {
    Facebook,
    Twitter,
    Instagram,
    YouTube,
    GitHub,
    Email as EmailIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon,
    Movie as MovieIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const SocialIconButton = styled(IconButton)(({ theme }) => ({
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    margin: theme.spacing(0, 0.5),
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.2),
        transform: 'translateY(-3px)',
    },
}));

const FooterLink = styled(Link)(({ theme }) => ({
    display: 'block',
    marginBottom: theme.spacing(1),
    color: theme.palette.text.secondary,
    transition: 'all 0.2s ease',
    position: 'relative',
    paddingLeft: theme.spacing(1.5),
    '&:before': {
        content: '""',
        position: 'absolute',
        left: 0,
        top: '50%',
        width: 6,
        height: 6,
        borderRadius: '50%',
        backgroundColor: alpha(theme.palette.primary.main, 0.5),
        transform: 'translateY(-50%)',
        opacity: 0,
        transition: 'all 0.2s ease',
    },
    '&:hover': {
        color: theme.palette.primary.main,
        paddingLeft: theme.spacing(2),
        '&:before': {
            opacity: 1,
        },
    },
})) as typeof Link;

const ScrollToTopButton = styled(Button)(({ theme }) => ({
    position: 'absolute',
    right: theme.spacing(3),
    top: theme.spacing(-3),
    minWidth: 'auto',
    width: 40,
    height: 40,
    borderRadius: '50%',
    padding: 0,
    boxShadow: theme.shadows[4],
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    '&:hover': {
        backgroundColor: theme.palette.secondary.dark,
        transform: 'translateY(-3px)',
    },
    transition: 'all 0.3s ease',
}));

const FooterHeading = styled(Typography)(({ theme }) => ({
    position: 'relative',
    marginBottom: theme.spacing(2),
    fontWeight: 700,
    '&:after': {
        content: '""',
        position: 'absolute',
        left: 0,
        bottom: -8,
        width: 30,
        height: 3,
        backgroundColor: theme.palette.primary.main,
        borderRadius: theme.shape.borderRadius,
    },
}));

const Footer: React.FC = () => {
    const theme = useTheme();
    const currentYear = new Date().getFullYear();

    const handleScrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <Box
            component="footer"
            sx={{
                py: 8,
                px: 2,
                mt: 'auto',
                position: 'relative',
                backgroundColor: theme.palette.mode === 'dark'
                    ? alpha(theme.palette.background.paper, 0.95)
                    : alpha(theme.palette.grey[100], 0.95),
                borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                boxShadow: `0 -10px 40px ${alpha(theme.palette.common.black, 0.05)}`,
            }}
        >
            <ScrollToTopButton
                variant="contained"
                onClick={handleScrollToTop}
                aria-label="Scroll to top"
            >
                <KeyboardArrowUpIcon />
            </ScrollToTopButton>

            <Container maxWidth="lg">
                <Grid container spacing={4} justifyContent="space-between">
                    <Grid item xs={12} sm={6} md={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <MovieIcon sx={{ fontSize: 28, color: theme.palette.secondary.main, mr: 1 }} />
                            <Typography
                                variant="h5"
                                color="text.primary"
                                sx={{
                                    fontWeight: 800,
                                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Movie Reviews
                            </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Discover, review, and discuss your favorite movies and TV shows.
                            Join our community of film enthusiasts and share your passion for cinema!
                        </Typography>

                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                backgroundColor: alpha(theme.palette.background.paper, 0.5),
                                borderRadius: 2,
                                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            }}
                        >
                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                Subscribe to our newsletter
                            </Typography>
                            <Stack direction="row" spacing={1}>
                                <TextField
                                    size="small"
                                    placeholder="Your email"
                                    fullWidth
                                    InputProps={{
                                        startAdornment: <EmailIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />,
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: theme.shape.borderRadius * 2,
                                        }
                                    }}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        borderRadius: theme.shape.borderRadius * 2,
                                        px: 2,
                                    }}
                                >
                                    Join
                                </Button>
                            </Stack>
                        </Paper>

                        <Box sx={{ mt: 3, display: 'flex' }}>
                            <SocialIconButton color="primary" aria-label="Facebook">
                                <Facebook />
                            </SocialIconButton>
                            <SocialIconButton color="primary" aria-label="Twitter">
                                <Twitter />
                            </SocialIconButton>
                            <SocialIconButton color="primary" aria-label="Instagram">
                                <Instagram />
                            </SocialIconButton>
                            <SocialIconButton color="primary" aria-label="YouTube">
                                <YouTube />
                            </SocialIconButton>
                            <SocialIconButton color="primary" aria-label="GitHub">
                                <GitHub />
                            </SocialIconButton>
                        </Box>
                    </Grid>

                    <Grid item xs={6} sm={6} md={2}>
                        <FooterHeading variant="subtitle1" color="text.primary">
                            Explore
                        </FooterHeading>
                        <FooterLink component={RouterLink} to="/" color="inherit">
                            Home
                        </FooterLink>
                        <FooterLink component={RouterLink} to="/search" color="inherit">
                            Search
                        </FooterLink>
                        <FooterLink component={RouterLink} to="/movies" color="inherit">
                            Movies
                        </FooterLink>
                        <FooterLink component={RouterLink} to="/tv" color="inherit">
                            TV Shows
                        </FooterLink>
                        <FooterLink component={RouterLink} to="/genres" color="inherit">
                            Genres
                        </FooterLink>
                    </Grid>

                    <Grid item xs={6} sm={6} md={2}>
                        <FooterHeading variant="subtitle1" color="text.primary">
                            Account
                        </FooterHeading>
                        <FooterLink component={RouterLink} to="/login" color="inherit">
                            Login
                        </FooterLink>
                        <FooterLink component={RouterLink} to="/register" color="inherit">
                            Register
                        </FooterLink>
                        <FooterLink component={RouterLink} to="/profile" color="inherit">
                            Profile
                        </FooterLink>
                        <FooterLink component={RouterLink} to="/watchlist" color="inherit">
                            Watchlist
                        </FooterLink>
                        <FooterLink component={RouterLink} to="/reviews" color="inherit">
                            My Reviews
                        </FooterLink>
                    </Grid>

                    <Grid item xs={6} sm={6} md={2}>
                        <FooterHeading variant="subtitle1" color="text.primary">
                            Legal
                        </FooterHeading>
                        <FooterLink component={RouterLink} to="/terms" color="inherit">
                            Terms of Use
                        </FooterLink>
                        <FooterLink component={RouterLink} to="/privacy" color="inherit">
                            Privacy Policy
                        </FooterLink>
                        <FooterLink component={RouterLink} to="/about" color="inherit">
                            About Us
                        </FooterLink>
                        <FooterLink component={RouterLink} to="/contact" color="inherit">
                            Contact
                        </FooterLink>
                        <FooterLink component={RouterLink} to="/faq" color="inherit">
                            FAQ
                        </FooterLink>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4, opacity: 0.1 }} />

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    opacity: 0.8,
                }}>
                    <Typography variant="body2" color="text.secondary">
                        © {currentYear} Movie Reviews. All rights reserved.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Powered by{' '}
                        <Link
                            href="https://www.themoviedb.org/"
                            target="_blank"
                            rel="noopener noreferrer"
                            color="inherit"
                            sx={{
                                fontWeight: 'bold',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    color: theme.palette.primary.main,
                                }
                            }}
                        >
                            TMDB
                        </Link>
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer; 