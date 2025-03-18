import React from 'react';
import {
    Typography,
    Box,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActionArea,
    Chip,
    useTheme
} from '@mui/material';
import { Movie } from '../../types';
import { getImageUrl, formatYear } from '../../utils/helpers';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';

interface SimilarMoviesProps {
    movies: Movie[];
    title?: string;
}

const MovieCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
        transform: 'scale(1.03)',
        boxShadow: theme.shadows[8]
    },
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden'
}));

const MovieImage = styled(CardMedia)(({ theme }) => ({
    height: 0,
    paddingTop: '150%', // 2:3 aspect ratio
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative'
}));

const RatingChip = styled(Chip)(({ theme }) => ({
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontWeight: 'bold'
}));

const MovieTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    marginBottom: theme.spacing(0.5),
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineHeight: '1.2em',
    height: '2.4em'
}));

const SimilarMovies: React.FC<SimilarMoviesProps> = ({
    movies,
    title = 'Similar Movies'
}) => {
    const theme = useTheme();

    // Only show up to 6 similar movies
    const displayMovies = movies.slice(0, 6);

    return (
        <Box sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
                {title}
            </Typography>
            <Grid container spacing={2}>
                {displayMovies.map((movie) => (
                    <Grid item xs={6} sm={4} md={2} key={movie.id}>
                        <MovieCard>
                            <CardActionArea component={Link} to={`/movie/${movie.id}`}>
                                <Box sx={{ position: 'relative' }}>
                                    <MovieImage
                                        image={getImageUrl(movie.poster_path, 'w300')}
                                        title={movie.title}
                                    />
                                    {movie.vote_average > 0 && (
                                        <RatingChip
                                            label={movie.vote_average.toFixed(1)}
                                            size="small"
                                        />
                                    )}
                                </Box>
                                <CardContent sx={{ flexGrow: 1, p: 1.5 }}>
                                    <MovieTitle variant="subtitle2">
                                        {movie.title}
                                    </MovieTitle>
                                    <Typography variant="body2" color="text.secondary">
                                        {formatYear(movie.release_date)}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </MovieCard>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default SimilarMovies; 