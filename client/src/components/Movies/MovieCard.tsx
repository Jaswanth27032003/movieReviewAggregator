import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Typography,
    Box,
    Chip,
    Rating,
    styled,
    useTheme,
    alpha,
} from '@mui/material';
import { Movie, Genre } from '../../types';
import { getImageUrl, formatDate, truncateText } from '../../utils/helpers';
import StarIcon from '@mui/icons-material/Star';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TheatersIcon from '@mui/icons-material/Theaters';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: theme.shape.borderRadius * 2,
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)',
    '&:hover': {
        transform: 'translateY(-12px) scale(1.02)',
        boxShadow: '0 15px 30px rgba(0, 0, 0, 0.25)',
        '& .MuiCardMedia-root': {
            transform: 'scale(1.08)',
        },
        '& .rating-badge': {
            transform: 'scale(1.1)',
        },
        '& .movie-overlay': {
            opacity: 1,
        },
    },
}));

const StyledCardMedia = styled(CardMedia)({
    height: 0,
    paddingTop: '150%', // 2:3 aspect ratio for movie posters
    transition: 'transform 0.6s ease-out',
    position: 'relative',
});

const RatingBadge = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: alpha(theme.palette.secondary.main, 0.9),
    color: theme.palette.secondary.contrastText,
    borderRadius: '50%',
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    zIndex: 2,
    transition: 'all 0.3s ease',
}));

const GenreChip = styled(Chip)(({ theme }) => ({
    margin: theme.spacing(0.5),
    marginLeft: 0,
    backgroundColor: alpha(theme.palette.primary.main, 0.8),
    color: theme.palette.primary.contrastText,
    fontWeight: 600,
    fontSize: '0.75rem',
    height: 24,
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: theme.palette.primary.main,
        transform: 'scale(1.05)',
    },
}));

const MovieOverlay = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(to bottom, 
        transparent 0%, 
        ${alpha(theme.palette.background.default, 0.3)} 50%, 
        ${alpha(theme.palette.background.default, 0.8)} 100%)`,
    opacity: 0,
    transition: 'opacity 0.4s ease',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    padding: theme.spacing(2),
    zIndex: 1,
}));

const ContentWrapper = styled(CardContent)(({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(2),
    transition: 'all 0.3s ease',
    '&:last-child': {
        paddingBottom: theme.spacing(2),
    },
}));

const InfoItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(0.5),
}));

// Extended Movie type to handle both movies and TV shows
interface MediaItem extends Movie {
    name?: string;
    first_air_date?: string;
    genre_ids?: number[];
}

interface MovieCardProps {
    movie: MediaItem;
    genreMap?: Record<number, string>;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, genreMap = {} }) => {
    const theme = useTheme();
    const [isHovered, setIsHovered] = useState(false);
    const imageUrl = getImageUrl(movie.poster_path, 'w500');
    const rating = movie.vote_average / 2; // Convert to 5-star scale

    // Get genres either from genre_ids (list view) or genres (detail view)
    let displayGenres: string[] = [];

    if (movie.genre_ids && movie.genre_ids.length > 0) {
        // For list views that use genre_ids
        displayGenres = movie.genre_ids
            .slice(0, 2)
            .map((id: number) => genreMap[id])
            .filter(Boolean);
    } else if (movie.genres && movie.genres.length > 0) {
        // For detail views that have the full genres array
        displayGenres = movie.genres
            .slice(0, 2)
            .map((genre: Genre) => genre.name);
    }

    return (
        <StyledCard
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <CardActionArea
                component={Link}
                to={`/movie/${movie.id}`}
                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
                <Box sx={{ position: 'relative' }}>
                    {/* Rating badge */}
                    {/* <RatingBadge className="rating-badge">
                        {movie.vote_average.toFixed(1)}
                    </RatingBadge> */}



                    {/* Movie poster */}
                    <StyledCardMedia
                        image={imageUrl || '/placeholder-poster.jpg'}
                        title={movie.title || movie.name || 'Media'}
                    />

                    {/* Hover overlay with quick info */}
                    <MovieOverlay className="movie-overlay" sx={{ opacity: isHovered ? 1 : 0 }}>
                        <Typography variant="body2" color="white" fontWeight="medium" sx={{ textShadow: '0 1px 3px rgba(0,0,0,0.7)' }}>
                            {truncateText(movie.overview, 120)}
                        </Typography>
                    </MovieOverlay>
                </Box>

                <ContentWrapper>
                    {/* Movie title */}
                    <Typography
                        gutterBottom
                        variant="subtitle1"
                        component="div"
                        fontWeight="bold"
                        noWrap
                        sx={{
                            fontSize: { xs: '0.95rem', sm: '1.1rem' },
                            color: theme.palette.text.primary,
                            transition: 'color 0.3s ease',
                        }}
                    >
                        {movie.title || movie.name || 'Untitled'}
                    </Typography>

                    {/* Release date */}
                    <InfoItem>
                        <CalendarTodayIcon sx={{ fontSize: '0.9rem', mr: 0.8, color: theme.palette.text.secondary }} />
                        <Typography variant="body2" color="text.secondary">
                            {formatDate(movie.release_date || movie.first_air_date || '')}
                        </Typography>
                    </InfoItem>

                    {/* Rating stars */}
                    <InfoItem sx={{ mb: 1 }}>
                        <TheatersIcon sx={{ fontSize: '0.9rem', mr: 0.8, color: theme.palette.text.secondary }} />
                        <Rating
                            value={rating}
                            precision={0.5}
                            size="small"
                            readOnly
                            sx={{ mr: 1 }}
                            icon={<StarIcon fontSize="inherit" sx={{ color: theme.palette.secondary.main }} />}
                            emptyIcon={<StarIcon fontSize="inherit" sx={{ opacity: 0.5 }} />}
                        />
                        <Typography variant="caption" color="text.secondary">
                            ({movie.vote_count})
                        </Typography>
                    </InfoItem>

                    {/* Genres */}
                    {displayGenres.length > 0 && (
                        <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap' }}>
                            {displayGenres.map((genre: string, index: number) => (
                                <GenreChip key={index} label={genre} size="small" />
                            ))}
                        </Box>
                    )}
                </ContentWrapper>
            </CardActionArea>
        </StyledCard>
    );
};

export default MovieCard; 