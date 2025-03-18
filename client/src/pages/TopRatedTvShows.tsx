import React, { useEffect, useState } from 'react';
import { Container, Typography, CircularProgress, Box } from '@mui/material';
import { getTopRatedTVShows } from '../services/sharedServices';
import { TVShow, MediaItem } from '../types';
import MovieGrid from '../components/Movies/MovieGrid';

const TopRatedTVShowsPage: React.FC = () => {
    const [tvShows, setTVShows] = useState<TVShow[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to the top
    }, []);

    useEffect(() => {
        const getTVShows = async () => {
            try {
                setLoading(true);
                const data = await getTopRatedTVShows();
                setTVShows(data.results || []);
                console.log('Fetched Top Rated TV Shows:', data.results); // Debug log
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred.');
                }
            } finally {
                setLoading(false);
            }
        };

        getTVShows();
    }, []);

    // Map TV shows to MediaItem for MovieGrid
    const mappedTVShows: MediaItem[] = tvShows.map((show) => {
        const mappedShow = {
            id: show.id,
            title: show.name || 'Unknown',
            name: show.name,
            overview: show.overview,
            poster_path: show.poster_path,
            backdrop_path: show.backdrop_path || '',
            release_date: show.first_air_date || '',
            vote_average: show.vote_average || 0,
            vote_count: show.vote_count || 0,
            genre_ids: show.genre_ids || [],
        };
        console.log('Mapped TV Show for Grid:', mappedShow); // Debug log
        return mappedShow;
    });

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container>
                <Typography variant="h5" color="error" align="center">
                    Error: {error}
                </Typography>
            </Container>
        );
    }

    return (
        <Container>
            <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', mt: 4 }}>
                Top Rated TV Shows
            </Typography>
            <MovieGrid
                movies={mappedTVShows}
                mediaType="tv" // Explicitly set mediaType to 'tv'
                title="Top Rated TV Shows"
            />
        </Container>
    );
};

export default TopRatedTVShowsPage;