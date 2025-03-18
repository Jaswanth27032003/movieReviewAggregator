import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    IconButton,
    useTheme,
    alpha,
    styled,
    Skeleton,
    Tooltip
} from '@mui/material';
import { Movie, MediaItem } from '../../types';
import { getImageUrl, formatDate } from '../../utils/helpers';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import StarIcon from '@mui/icons-material/Star';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// Extended Movie type to handle both movies and TV shows with genre_ids


interface TrendingScrollerProps {
    movies: MediaItem[];
    title?: string;
    loading?: boolean;
    genreMap?: Record<number, string>;
}

const ScrollContainer = styled(Box)(({ theme }) => ({
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
    marginBottom: theme.spacing(6),
    padding: theme.spacing(3, 0),
    borderRadius: theme.shape.borderRadius * 2,
    background: `linear-gradient(to right, 
        ${alpha(theme.palette.primary.main, 0.05)}, 
        ${alpha(theme.palette.secondary.main, 0.05)}, 
        ${alpha(theme.palette.primary.main, 0.05)})`,
}));

const MovieGrid = styled(Box)(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: theme.spacing(3),
    padding: theme.spacing(2),
}));

const ScrollWrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    overflowX: 'auto',
    scrollBehavior: 'smooth',
    padding: theme.spacing(2, 0),
    '&::-webkit-scrollbar': {
        display: 'none', /* Hide scrollbar for Chrome, Safari and Opera */
    },
    '-ms-overflow-style': 'none',  /* IE and Edge */
    'scrollbar-width': 'none',  /* Firefox */
}));

const MovieCard = styled(Box)(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius * 2,
    overflow: 'hidden',
    minWidth: 280,
    height: 400,
    margin: theme.spacing(0, 1.5),
    cursor: 'pointer',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    '&:hover': {
        transform: 'scale(1.03)',
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.25)',
        '& .movie-overlay': {
            opacity: 1,
        },
        '& .movie-poster': {
            transform: 'scale(1.08)',
        },
        '& .movie-number': {
            transform: 'scale(1.05) translateY(-5px)',
            opacity: 1,
            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)',
        },
        '& .movie-actions': {
            opacity: 1,
            transform: 'translateY(0)',
        },
    },
}));

const MoviePoster = styled('img')(({ theme }) => ({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.6s ease-out',
}));

const MovieOverlay = styled(Box)(({ theme }) => ({
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing(2),
    background: `linear-gradient(to top, 
        ${alpha(theme.palette.background.default, 0.95)} 0%, 
        ${alpha(theme.palette.background.default, 0.8)} 40%, 
        ${alpha(theme.palette.background.default, 0.4)} 70%, 
        transparent 100%)`,
    opacity: 0.9,
    transition: 'all 0.4s ease',
}));

const MovieNumber = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: -8,
    width: 100,
    height: 120,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '5rem',
    fontWeight: 900,
    zIndex: 100,
    overflow: 'visible',
    mixBlendMode: 'screen',
    WebkitTextStroke: '1px rgba(3, 4, 4, 0.64)',
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    opacity: 0.9,
    // background: 'linear-gradient(to left,rgb(241, 102, 67),rgb(241, 102, 67),  #FFFFFF)',
    // WebkitBackgroundClip: 'text',
    // WebkitTextFillColor: 'transparent',
    color: 'theme.palette.primary.dark',
    textShadow: `
        2px 2px 5px rgba(135, 206, 235, 0.3), /* Sky blue shadow */
        -2px -2px 5px rgba(255, 255, 255, 0.3), /* White shadow */
        4px 4px 10px rgba(135, 206, 235, 0.3) /* Softer sky blue glow */
    `,

    '&:after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        // zIndex: 100,
    }
}));


const RatingBadge = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: alpha(theme.palette.primary.main, 0.85),
    color: theme.palette.secondary.contrastText,
    borderRadius: '12px',
    padding: '4px 12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '0.9rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    zIndex: 2,
    transition: 'all 0.3s ease',
    '&:before': {
        content: '"⭐"',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 12,
        height: 12,
        marginRight: 6,
    }
}));

const ScrollButton = styled(IconButton)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
    color: theme.palette.text.primary,
    zIndex: 10,
    width: 48,
    height: 48,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.9),
        color: theme.palette.primary.contrastText,
        transform: 'translateY(-50%) scale(1.1)',
        boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
    },
    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
}));

const MovieActions = styled(Box)(({ theme }) => ({
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing(2),
    opacity: 0,
    transform: 'translateY(20px)',
    transition: 'all 0.3s ease',
    zIndex: 3,
}));

const DetailsButton = styled(IconButton)(({ theme }) => ({
    backgroundColor: alpha(theme.palette.primary.main, 0.9),
    color: theme.palette.common.white,
    position: 'absolute',
    top: 10,
    right: 15,
    '&:hover': {
        backgroundColor: theme.palette.primary.main,
        transform: 'scale(1.1)',
    },
    transition: 'all 0.2s ease',
}));


const SectionTitle = styled(Typography)(({ theme }) => ({
    position: 'relative',
    display: 'inline-block',
    marginBottom: theme.spacing(2),
    fontWeight: 800,
    '&:after': {
        content: '""',
        position: 'absolute',
        bottom: -8,
        left: 0,
        width: '40%',
        height: 4,
        backgroundColor: theme.palette.primary.main,
        borderRadius: 2,
    },
}));

const TrendingScroller: React.FC<TrendingScrollerProps> = ({
    movies,
    title,
    loading,
    genreMap,
}) => {
    const theme = useTheme();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    let navigate = useNavigate();

    // Generate a unique ID for this scroller instance
    const scrollerId = useRef(`scroller-${Math.random().toString(36).substr(2, 9)}`).current;

    const handleMovieClick = (item: MediaItem) => {
        // Use the media_type property or determine type from the item structure
        const mediaType = item.media_type || (item.first_air_date ? 'tv' : 'movie');

        // Navigate to the details page with the correct media type
        navigate(`/details/${mediaType}/${item.id}`);


    };

    const renderSkeleton = () => {
        return Array.from(new Array(10)).map((_, index) => (
            <Box
                key={`skeleton-${index}`}
                sx={{
                    minWidth: 280,
                    height: 400,
                    margin: theme.spacing(0, 1.5),
                    borderRadius: theme.shape.borderRadius * 2,
                    overflow: 'hidden',
                }}
            >
                <Skeleton
                    variant="rectangular"
                    width="100%"
                    height="100%"
                    animation="wave"
                    sx={{
                        borderRadius: theme.shape.borderRadius * 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.1)
                    }}
                />
            </Box>
        ));
    };

    const renderMovies = () => {
        return movies.map((item, index) => {
            const posterUrl = getImageUrl(item.poster_path, 'w500');
            const rating = item.vote_average || 0;
            const displayTitle = item.title || item.name || '';
            const releaseDate = item.release_date || item.first_air_date || '';

            // Get genre names from IDs using the genreMap
            const genreNames = item.genre_ids
                ? item.genre_ids.slice(0, 3).map((id: number) => genreMap?.[id] || '')
                : item.genres?.slice(0, 3).map(genre => genre.name) || [];

            return (
                <MovieCard key={item.id}>
                    <Box sx={{ height: '100%', position: 'relative' }}>
                        <MoviePoster
                            src={posterUrl}
                            alt={displayTitle}
                            className="movie-poster"
                            loading="lazy"
                        />
                        <MovieNumber className="movie-number">
                            {index + 1}
                        </MovieNumber>
                        <RatingBadge>
                            {rating.toFixed(1)}
                        </RatingBadge>
                        <MovieActions className="movie-actions">
                            <Tooltip title="Details">
                                <DetailsButton size="large" onClick={() => handleMovieClick(item)}>
                                    <InfoOutlinedIcon fontSize="medium" />
                                </DetailsButton>
                            </Tooltip>
                        </MovieActions>
                        <MovieOverlay className="movie-overlay">
                            <Typography
                                variant="h6"
                                fontWeight="bold"
                                noWrap
                                sx={{ color: theme.palette.text.primary }}
                            >
                                {displayTitle}
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, mb: 1 }}>
                                <StarIcon sx={{ color: theme.palette.secondary.main, mr: 0.5, fontSize: '1rem' }} />
                                <Typography variant="body2" color="text.secondary">
                                    {rating.toFixed(1)}/10
                                </Typography>
                            </Box>

                            {releaseDate && (
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    {formatDate(releaseDate)}
                                </Typography>
                            )}

                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {genreNames.filter(Boolean).map((genre: string, idx: number) => (
                                    <Typography
                                        key={idx}
                                        variant="caption"
                                        sx={{
                                            color: theme.palette.text.secondary,
                                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                            padding: '2px 8px',
                                            borderRadius: '4px',
                                        }}
                                    >
                                        {genre}
                                    </Typography>
                                ))}
                            </Box>
                        </MovieOverlay>
                    </Box>
                </MovieCard>
            );
        });
    };

    return (
        <Box sx={{ mb: 6 }}>
            {title && (
                <SectionTitle variant="h4">
                    {title}
                </SectionTitle>
            )}

            <ScrollContainer>
                <ScrollWrapper
                    ref={scrollContainerRef}
                    id={scrollerId}
                >
                    {loading ? renderSkeleton() : renderMovies()}
                </ScrollWrapper>
            </ScrollContainer>
        </Box>
    );
};

export default TrendingScroller; 