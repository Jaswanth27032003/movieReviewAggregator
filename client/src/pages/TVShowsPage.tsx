import React, { useState, useEffect } from 'react';
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
import { Movie, Genre, MediaItem } from '../types'; // Import MediaItem
import { getTvShows, getMovieGenres } from '../services/sharedServices';
import { TVShow } from '../types'; // Import the TVShow type
import MovieGrid from '../components/Movies/MovieGrid';
import { useScroll } from '../context/ScrollContext';

// Define MenuProps for the Select component
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

const TVShowsPage: React.FC = () => {
    const theme = useTheme();
    const [tvShows, setTVShows] = useState<TVShow[]>([]); // Update to TVShow[]
    const [genres, setGenres] = useState<Genre[]>([]);
    const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [genreMap, setGenreMap] = useState<Record<number, string>>({});

    const { scrollRef } = useScroll();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch genres
                const genresData = await getMovieGenres();
                setGenres(genresData);

                // Create genre map
                const genreMapping: Record<number, string> = {};
                genresData.forEach((genre: Genre) => {
                    genreMapping[genre.id] = genre.name;
                });
                setGenreMap(genreMapping);

                // Fetch TV shows
                const tvShowsData = await getTvShows(page);
                setTVShows(tvShowsData.results || []);
                setTotalPages(tvShowsData.total_pages || 1);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch TV shows. Please try again later.');
                setLoading(false);
            }
        };

        fetchData();
    }, [page]);

    // Filter TV shows by selected genres
    const filteredTVShows: MediaItem[] = tvShows.map((show) => ({
        id: show.id,
        title: show.name || 'Unknown', // Ensure `title` is always a string
        name: show.name,
        overview: show.overview,
        poster_path: show.poster_path,
        backdrop_path: (show as any).backdrop_path || '', // Default value if missing
        release_date: show.first_air_date || '', // Map `first_air_date` to `release_date`
        vote_average: show.vote_average || 0,
        vote_count: (show as any).vote_count || 0, // Fallback to 0 if missing
        genre_ids: (show as any).genre_ids, // Fallback to an empty array
    }));

    const handleGenreChange = (event: SelectChangeEvent<number[]>) => {
        const value = event.target.value as number[];
        setSelectedGenres(value);
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
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
                    TV Shows
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
                            renderValue={(selected) => (
                                selected.length === 0
                                    ? 'All Genres'
                                    : selected.map(id => genreMap[id]).join(', ')
                            )}
                            MenuProps={MenuProps} // Use MenuProps here
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
                        {filteredTVShows.length === 0 ? (
                            <Box sx={{ textAlign: 'center', my: 8 }}>
                                <Typography variant="h5" gutterBottom>
                                    No TV shows found
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Try changing your filter criteria
                                </Typography>
                            </Box>
                        ) : (
                            <>
                                <MovieGrid
                                    movies={filteredTVShows}
                                    mediaType="tv" // Add this prop
                                    genreMap={genreMap}
                                />

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                                        <Pagination
                                            count={totalPages}
                                            page={page}
                                            onChange={handlePageChange}
                                            color="primary"
                                            size="large"
                                            showFirstButton
                                            showLastButton
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

export default TVShowsPage;