import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Button,
    Box,
    CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface WatchlistItem {
    mediaId: number;
    mediaType: 'movie' | 'tv';
    poster_path: string;
    title: string;
}

const Watchlist: React.FC = () => {
    const { state } = useAuth();
    const { isAuthenticated, authToken } = state;
    const navigate = useNavigate();
    const [watchlistItems, setWatchlistItems] = useState<WatchlistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const fetchWatchlist = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/api/watchlist', {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                const items = response.data.data || response.data || [];
                setWatchlistItems(Array.isArray(items) ? items : []);
            } catch (err) {
                setError('Failed to load watchlist. Please try again.');
                console.error('Error fetching watchlist:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchWatchlist();
    }, [isAuthenticated, authToken, navigate]);

    const handleRemoveFromWatchlist = async (mediaId: number, mediaType: 'movie' | 'tv') => {
        try {
            await axios.delete(`/api/watchlist/${mediaId}?mediaType=${mediaType}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            setWatchlistItems((prevItems) =>
                prevItems.filter((item) => !(item.mediaId === mediaId && item.mediaType === mediaType))
            );
        } catch (err) {
            console.error('Error removing from watchlist:', err);
            setError('Failed to remove item from watchlist.');
        }
    };

    if (loading) {
        return (
            <Container sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="error">{error}</Typography>
                <Button variant="contained" onClick={() => window.location.reload()} sx={{ mt: 2 }}>
                    Retry
                </Button>
            </Container>
        );
    }

    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>
                My Watchlist
            </Typography>
            {watchlistItems.length === 0 ? (
                <Typography>No items in your watchlist yet.</Typography>
            ) : (
                <Grid container spacing={3}>
                    {watchlistItems.map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={`${item.mediaId}-${item.mediaType}`}>
                            <Card sx={{ maxWidth: 345, height: '100%' }}>
                                <CardMedia
                                    component="img"
                                    height="300"
                                    image={`https://image.tmdb.org/t/p/w500${item.poster_path || '/default-poster.jpg'}`}
                                    alt={item.title || 'Untitled'}
                                    sx={{ objectFit: 'cover' }}
                                />
                                <CardContent>
                                    <Typography variant="h6">{item.title}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {item.mediaType === 'movie' ? 'Movie' : 'TV Show'}
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        onClick={() => handleRemoveFromWatchlist(item.mediaId, item.mediaType)}
                                        sx={{ mt: 2 }}
                                    >
                                        Remove
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default Watchlist;