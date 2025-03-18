import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScroll } from '../context/ScrollContext';
import { getTrendingMovies, getMovieGenres } from '../services/api';
import {
    Container,
    Typography,
    Box,
    Grid,
    CircularProgress,
    Pagination,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    OutlinedInput,
    Checkbox,
    ListItemText,
    useTheme,
    alpha,
    SelectChangeEvent
} from '@mui/material';
import { Movie, Genre } from '../types';
import MovieGrid from '../components/Movies/MovieGrid';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const MoviesPage: React.FC = () => {
    const theme = useTheme();
    const [movies, setMovies] = useState<Movie[]>([]);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [genreMap, setGenreMap] = useState<Record<number, string>>({});
    const { scrollRef } = useScroll();

    // Use a separate effect for genres to avoid refetching on page change
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const genresData = await getMovieGenres();

                // Verify genresData is an array before proceeding
                if (!Array.isArray(genresData)) {
                    console.error('Error: genres data is not an array', genresData);
                    throw new Error('Invalid genres data format');
                }

                setGenres(genresData);

                // Create genre map
                const genreMapping: Record<number, string> = {};
                genresData.forEach((genre: Genre) => {
                    if (genre && typeof genre.id === 'number' && typeof genre.name === 'string') {
                        genreMapping[genre.id] = genre.name;
                    }
                });
                setGenreMap(genreMapping);
            } catch (error) {
                console.error('Error fetching genres:', error);
                setError('Failed to fetch genres. Please try again later.');
            }
        };

        fetchGenres();
    }, []); // Only run once on component mount

    // Separate effect for movies that depends on page
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);

                console.log(`Fetching movies for page ${page}`); // Debug log

                // Pass the page parameter to getTrendingMovies
                const moviesData = await getTrendingMovies(page);

                console.log(`Received ${moviesData?.results?.length || 0} movies for page ${page}`); // Debug log

                setMovies(moviesData?.results || []);
                setTotalPages(moviesData?.total_pages || 1);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching movies:', error);
                setError('Failed to fetch movies. Please try again later.');
                setLoading(false);
            }
        };

        fetchMovies();
    }, [page]); // Depend on page

    // Filter movies by selected genres - with additional safety checks
    const filteredMovies = selectedGenres.length > 0
        ? movies.filter(movie => {
            // Check for movie.genres
            const matchesMovieGenres = Array.isArray(movie.genres) &&
                movie.genres.some(genre => genre && selectedGenres.includes(genre.id));

            // Check for movie.genre_ids
            const genreIds = (movie as any).genre_ids;
            const matchesGenreIds = Array.isArray(genreIds) &&
                genreIds.some((id: number) => typeof id === 'number' && selectedGenres.includes(id));

            return matchesMovieGenres || matchesGenreIds;
        })
        : movies;

    const handleGenreChange = (event: SelectChangeEvent<number[]>) => {
        const value = event.target.value as number[];
        setSelectedGenres(value);
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        console.log(`Changing page from ${page} to ${value}`); // Debug log
        setPage(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (error) {
        return (
            <Box sx={{ textAlign: 'center', my: 8 }}>
                <Typography variant="h5" color="error" gutterBottom>
                    {error}
                </Typography>
            </Box>
        );
    }

    return (
        <Box ref={scrollRef} sx={{ overflowY: 'auto', height: '100vh', paddingBottom: 4 }}>
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Typography
                    variant="h3"
                    component="h1"
                    fontWeight="bold"
                    sx={{ mb: 4 }}
                >
                    Movies
                </Typography>

                {/* Genre filter dropdown */}
                <Box sx={{ mb: 4, maxWidth: 400 }}>
                    <FormControl fullWidth>
                        <InputLabel id="genre-filter-label">Filter by Genre</InputLabel>
                        <Select
                            labelId="genre-filter-label"
                            id="genre-filter"
                            multiple
                            value={selectedGenres}
                            onChange={handleGenreChange}
                            input={<OutlinedInput label="Filter by Genre" />}
                            renderValue={(selected) => {
                                if (!selected || selected.length === 0) return 'All Genres';
                                return selected
                                    .map(id => genreMap[id] || `Genre ${id}`)
                                    .join(', ');
                            }}
                            MenuProps={MenuProps}
                            sx={{
                                '& .MuiSelect-select': {
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 0.5,
                                }
                            }}
                        >
                            {genres.map((genre) => (
                                <MenuItem key={genre.id} value={genre.id}>
                                    <Checkbox checked={selectedGenres.includes(genre.id)} />
                                    <ListItemText primary={genre.name} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {filteredMovies.length === 0 ? (
                            <Typography variant="h6" sx={{ textAlign: 'center', my: 8 }}>
                                No movies found matching your filters.
                            </Typography>
                        ) : (
                            <>
                                <MovieGrid
                                    movies={filteredMovies}
                                    loading={loading}
                                    genreMap={genreMap}
                                    mediaType="movie" // Add this prop
                                />

                                {totalPages > 1 && (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                                        <Pagination
                                            count={totalPages > 500 ? 500 : totalPages} // TMDB usually limits to 500 pages max
                                            page={page}
                                            onChange={handlePageChange}
                                            color="primary"
                                            size="large"
                                            sx={{
                                                '& .MuiPaginationItem-root': {
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        transform: 'translateY(-2px)',
                                                        backgroundColor: alpha(theme.palette.primary.main, 0.1)
                                                    }
                                                }
                                            }}
                                        />
                                    </Box>
                                )}
                            </>
                        )}
                    </>
                )}
            </Container>
        </Box>
    );
};

export default MoviesPage;