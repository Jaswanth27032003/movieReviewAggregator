import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Rating,
    Chip,
    useTheme,
    alpha,
    styled,
    Container,
    IconButton,
    useMediaQuery,
    Dialog,
    DialogContent,
} from '@mui/material';
import { PlayArrow, Info, NavigateBefore, NavigateNext, Star, Close } from '@mui/icons-material';
import { Movie, Genre } from '../../types';
import { getImageUrl, formatDate } from '../../utils/helpers';

interface Video {
    key: string;
    site: string;
    type: string;
    official: boolean;
}

// Extended Movie type to handle both movies and TV shows
interface MediaItem {
    id: number;
    title?: string;
    name?: string;
    overview: string;
    backdrop_path: string;
    poster_path: string;
    release_date?: string;
    first_air_date?: string;
    vote_average: number;
    vote_count: number;
    genre_ids?: number[];
    genres?: Genre[];
    media_type?: 'movie' | 'tv';
    tagline?: string;
    videos?: {
        results: Video[];
    } | undefined;
}

interface HeroProps {
    movies: MediaItem[];
}

// Styled components
const HeroContainer = styled(Box)(({ theme }) => ({
    position: 'relative',
    height: '85vh',
    minHeight: 550,
    maxHeight: 900,
    width: '100%',
    overflow: 'hidden',
    marginBottom: theme.spacing(6),
    [theme.breakpoints.down('md')]: {
        height: '70vh',
        minHeight: 450,
    },
}));

const HeroBackdrop = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    transition: 'opacity 0.8s ease, transform 10s ease',
    transform: 'scale(1.05)',
    '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: `linear-gradient(to right, 
            ${alpha(theme.palette.background.default, 0.95)} 0%, 
            ${alpha(theme.palette.background.default, 0.8)} 20%, 
            ${alpha(theme.palette.background.default, 0.4)} 50%, 
            ${alpha(theme.palette.background.default, 0.2)} 80%, 
            ${alpha(theme.palette.background.default, 0.1)} 100%),
            linear-gradient(to top, 
            ${theme.palette.background.default} 0%, 
            ${alpha(theme.palette.background.default, 0.8)} 15%, 
            ${alpha(theme.palette.background.default, 0.4)} 40%, 
            ${alpha(theme.palette.background.default, 0)} 100%)`,
    },
}));

const HeroContent = styled(Box)(({ theme }) => ({
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(6, 0),
    zIndex: 2,
    [theme.breakpoints.down('md')]: {
        alignItems: 'flex-end',
        paddingBottom: theme.spacing(10),
    },
}));

const NavigationButton = styled(IconButton)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 2,
    backgroundColor: alpha(theme.palette.background.paper, 0.2),
    backdropFilter: 'blur(4px)',
    color: theme.palette.common.white,
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.8),
        transform: 'translateY(-50%) scale(1.1)',
    },
}));

const RatingBadge = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    backgroundColor: alpha(theme.palette.primary.main, 0.9),
    color: theme.palette.primary.contrastText,
    borderRadius: '20px',
    padding: theme.spacing(0.5, 1.5),
    marginRight: theme.spacing(2),
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
}));

const AnimatedButton = styled(Button)(({ theme }) => ({
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-3px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    },
}));

const GenreChip = styled(Chip)(({ theme }) => ({
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
    color: theme.palette.primary.main,
    fontWeight: 500,
    backdropFilter: 'blur(4px)',
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.3),
        transform: 'translateY(-2px)',
    },
}));

const Hero: React.FC<HeroProps> = ({ movies }) => {
    const theme = useTheme();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [trailerOpen, setTrailerOpen] = useState(false);
    const [trailerKey, setTrailerKey] = useState<string | null>(null);
    const navigate = useNavigate();

    // Auto-rotate featured movies
    useEffect(() => {
        if (movies.length <= 1) return;

        const interval = setInterval(() => {
            handleNext();
        }, 5000);

        return () => clearInterval(interval);
    }, [currentIndex, movies.length]);

    const handlePrev = () => {
        if (isTransitioning || movies.length <= 1) return;

        setIsTransitioning(true);
        setCurrentIndex((prev) => (prev === 0 ? movies.length - 1 : prev - 1));

        setTimeout(() => {
            setIsTransitioning(false);
        }, 800);
    };

    const handleNext = () => {
        if (isTransitioning || movies.length <= 1) return;

        setIsTransitioning(true);
        setCurrentIndex((prev) => (prev === movies.length - 1 ? 0 : prev + 1));

        setTimeout(() => {
            setIsTransitioning(false);
        }, 800);
    };

    const handleViewDetails = () => {
        const currentMovie = movies[currentIndex];
        const mediaType = currentMovie.media_type || 'movie';
        navigate(`/details/${mediaType}/${currentMovie.id}`);
    };


    // Update the handleWatchNow function
    const handleWatchNow = () => {
        const currentMovie = movies[currentIndex];

        // Check if videos array exists and has items
        if (currentMovie?.videos?.results && Array.isArray(currentMovie.videos.results)) {
            console.log('Available videos:', currentMovie.videos.results); // Debug log
            // Try to find the best trailer
            const trailer = currentMovie.videos.results.find(
                video =>
                    video.type === 'Trailer' &&
                    video.site === 'YouTube' &&
                    video.official
            ) ||
                currentMovie.videos.results.find(
                    video =>
                        video.type === 'Trailer' &&
                        video.site === 'YouTube'
                ) ||
                currentMovie.videos.results.find(
                    video =>
                        video.site === 'YouTube'
                );

            if (trailer?.key) {
                setTrailerKey(trailer.key);
                setTrailerOpen(true);
                return;
            }
        }

        // If no trailer found, log for debugging
        console.log('No trailer found:', currentMovie);
        alert('No trailer available for this movie.');
    };

    // Update the getTrailerUrl function
    const getTrailerUrl = () => {
        if (!trailerKey) return '';
        return `https://www.youtube.com/embed/${trailerKey}?autoplay=1&origin=${window.location.origin}&rel=0&showinfo=0&iv_load_policy=3&modestbranding=1&controls=1`;
    };

    const handleCloseTrailer = () => {
        setTrailerOpen(false);
        setTrailerKey(null);
    };

    if (!movies.length) {
        return null;
    }

    const currentMovie = movies[currentIndex];
    const backdropUrl = getImageUrl(currentMovie.backdrop_path, 'original');
    const rating = currentMovie.vote_average / 2; // Convert to 5-star scale

    return (
        <HeroContainer className="fade-in">
            <HeroBackdrop
                sx={{
                    backgroundImage: `url(${backdropUrl})`,
                    opacity: isTransitioning ? 0.3 : 1,
                    transform: isTransitioning ? 'scale(1.1)' : 'scale(1.05)',
                }}
            />

            {/* {movies.length > 1 && (
                <>
                    <NavigationButton
                        sx={{ left: { xs: 8, md: 24 } }}
                        onClick={handlePrev}
                        size="large"
                        aria-label="Previous movie"
                    >
                        <NavigateBefore />
                    </NavigationButton>
                    <NavigationButton
                        sx={{ right: { xs: 8, md: 24 } }}
                        onClick={handleNext}
                        size="large"
                        aria-label="Next movie"
                    >
                        <NavigateNext />
                    </NavigationButton>
                </>
            )} */}

            <HeroContent>
                <Container maxWidth="xl">
                    <Box
                        sx={{
                            maxWidth: { xs: '100%', md: '55%' },
                            opacity: isTransitioning ? 0.3 : 1,
                            transition: 'opacity 0.8s ease',
                            animation: 'slideUp 0.8s ease-out',
                        }}
                    >
                        <Typography
                            variant="h1"
                            component="h1"
                            fontWeight="bold"
                            gutterBottom
                            sx={{
                                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                                lineHeight: 1.1,
                                mb: 2,
                            }}
                        >
                            {currentMovie.title || currentMovie.name}
                        </Typography>

                        {currentMovie.tagline && (
                            <Typography
                                variant="h5"
                                gutterBottom
                                sx={{
                                    mb: 3,
                                    opacity: 0.9,
                                    fontWeight: 500,
                                    fontStyle: 'italic',
                                    textShadow: '0 1px 4px rgba(0,0,0,0.3)',
                                }}
                            >
                                {currentMovie.tagline}
                            </Typography>
                        )}

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <RatingBadge>
                                <Star sx={{ fontSize: 18, mr: 0.5 }} />
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {currentMovie.vote_average.toFixed(1)}
                                </Typography>
                            </RatingBadge>

                            {currentMovie.release_date && (
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontWeight: 500,
                                        backgroundColor: alpha(theme.palette.background.paper, 0.2),
                                        backdropFilter: 'blur(4px)',
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                    }}
                                >
                                    {formatDate(currentMovie.release_date)}
                                </Typography>
                            )}
                        </Box>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
                            {currentMovie.genres?.slice(0, isMobile ? 3 : 5).map((genre: Genre) => (
                                <GenreChip
                                    key={genre.id}
                                    label={genre.name}
                                    size="medium"
                                />
                            ))}
                        </Box>

                        <Typography
                            variant="body1"
                            paragraph
                            sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: { xs: 2, sm: 3, md: 4 },
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                mb: 4,
                                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                                maxWidth: '90%',
                                lineHeight: 1.6,
                                color: alpha(theme.palette.text.primary, 0.9),
                                textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                            }}
                        >
                            {currentMovie.overview}
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <AnimatedButton
                                variant="contained"
                                color="primary"
                                size="large"
                                startIcon={<PlayArrow />}
                                onClick={handleWatchNow}
                                sx={{
                                    px: 3,
                                    py: 1.2,
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                }}
                            >
                                Watch Trailer
                            </AnimatedButton>

                            <AnimatedButton
                                variant="outlined"
                                color="primary"
                                size="large"
                                startIcon={<Info />}
                                onClick={handleViewDetails}
                                sx={{
                                    px: 3,
                                    py: 1.2,
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    borderWidth: 2,
                                    backgroundColor: alpha(theme.palette.background.paper, 0.1),
                                    backdropFilter: 'blur(4px)',
                                }}
                            >
                                More Info
                            </AnimatedButton>
                        </Box>
                    </Box>
                </Container>
            </HeroContent>

            {/* Trailer Dialog */}
            <Dialog
                open={trailerOpen}
                onClose={handleCloseTrailer}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    sx: {
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                        overflow: 'hidden',
                        margin: { xs: 1, sm: 2, md: 4 },
                    }
                }}
            >
                <DialogContent
                    sx={{
                        p: 0,
                        position: 'relative',
                        aspectRatio: '16/9',
                        backgroundColor: '#000',
                    }}
                >
                    <IconButton
                        onClick={handleCloseTrailer}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            backgroundColor: alpha(theme.palette.background.paper, 0.5),
                            color: theme.palette.common.white,
                            zIndex: 1,
                            '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.8),
                            }
                        }}
                    >
                        <Close />
                    </IconButton>
                    {trailerOpen && trailerKey && (
                        <Box
                            component="iframe"
                            width="100%"
                            height="100%"
                            src={getTrailerUrl()}
                            title={`${currentMovie.title || currentMovie.name} Trailer`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            sx={{
                                border: 'none',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </HeroContainer>
    );
};

export default Hero;

