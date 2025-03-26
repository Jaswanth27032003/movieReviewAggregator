import React, { useState, useEffect, FormEvent } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Divider,
    Avatar,
    Rating,
    useTheme,
    IconButton,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { Review, ReviewFormData } from '../../types';
import reviewService from '../../services/reviewService'; // Adjust the path as needed
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../../context/AuthContext'; // Import useAuth

interface MovieReviewsProps {
    movieId: string;
    currentUserId?: string; // Keep for backwards compatibility
}

const Container = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    borderRadius: 12,
    backgroundColor: '#1A1A1A',
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(70, 130, 180, 0.1), rgba(255, 215, 0, 0.1))',
        backgroundSize: '200% 200%',
        zIndex: -1,
        animation: `${keyframes`
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        `} 15s ease-in-out infinite`,
    },
}));

const ReviewItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    padding: theme.spacing(2),
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    marginBottom: theme.spacing(2),
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
        transform: 'scale(1.02)',
        boxShadow: '0 4px 15px rgba(70, 130, 180, 0.2)',
    },
}));

const ReviewFormContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    borderRadius: 12,
    background: 'linear-gradient(135deg, rgba(70, 130, 180, 0.15), rgba(255, 215, 0, 0.15))',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    marginBottom: theme.spacing(3),
}));

const OverallReviewCard = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    borderRadius: 12,
    background: 'linear-gradient(135deg, rgba(70, 130, 180, 0.15), rgba(255, 215, 0, 0.15))',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    position: 'relative',
    boxShadow: '0 4px 15px rgba(70, 130, 180, 0.2)',
    zIndex: 1,
    animation: `${keyframes`
        0% { opacity: 0; transform: translateY(10px); }
        100% { opacity: 1; transform: translateY(0); }
    `} 0.8s ease-in-out`,
    '&:hover': {
        boxShadow: '0 6px 20px rgba(70, 130, 180, 0.3)',
    },
}));

const RatingIndicator = styled(Box)<{ value: number }>(({ theme, value }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    borderRadius: '50%',
    width: 60,
    height: 60,
    background: `conic-gradient(from 0deg, #FFD700 0%, #FFD700 ${value * 20}%, rgba(255, 255, 255, 0.1) ${value * 20}%, rgba(255, 255, 255, 0.1) 100%)`,
    border: '2px solid rgba(255, 255, 255, 0.2)',
    color: '#fff',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2), 0 0 10px rgba(255, 215, 0, 0.5)',
    animation: `${keyframes`
        0% { transform: scale(1); box-shadow: 0 0 10px rgba(255, 215, 0, 0.5); }
        50% { transform: scale(1.05); box-shadow: 0 0 20px rgba(255, 215, 0, 0.8); }
        100% { transform: scale(1); box-shadow: 0 0 10px rgba(255, 215, 0, 0.5); }
    `} 2s infinite ease-in-out`,
    transition: 'transform 0.3s ease',
    '&:hover': {
        transform: 'scale(1.1)',
    },
}));

const SentimentBadge = styled(Box)<{ sentiment: string }>(({ theme, sentiment }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(0.5, 2),
    borderRadius: 16,
    backgroundColor:
        sentiment === 'Highly Positive'
            ? 'rgba(127, 186, 122, 0.2)'
            : sentiment === 'Mixed'
                ? 'rgba(255, 206, 115, 0.2)'
                : 'rgba(255, 67, 150, 0.2)',
    color:
        sentiment === 'Highly Positive'
            ? '#7FBA7A'
            : sentiment === 'Mixed'
                ? '#FFCE73'
                : '#FF4396',
    fontWeight: 'bold',
    fontSize: '0.85rem',
    animation: `${keyframes`
        0% { transform: scale(0.5); opacity: 0; }
        60% { transform: scale(1.1); opacity: 1; }
        100% { transform: scale(1); }
    `} 0.8s ease`,
    transition: 'transform 0.3s ease',
    '&:hover': {
        transform: 'scale(1.05)',
    },
}));

const MovieReviews: React.FC<MovieReviewsProps> = ({ movieId, currentUserId }) => {
    const theme = useTheme();
    const { state: authState } = useAuth(); // Get auth state directly
    const [reviews, setReviews] = useState<Review[]>([]);
    const [totalReviews, setTotalReviews] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [limit] = useState<number>(5);
    const [newReview, setNewReview] = useState<ReviewFormData>({ rating: 0, content: '' });
    const [editReview, setEditReview] = useState<Review | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [socket, setSocket] = useState<Socket | null>(null);

    // Use the user ID from auth context (which is always up to date)
    const userId = authState.user?.id || currentUserId;

    // Log authentication state for debugging
    useEffect(() => {
        console.log('Auth state in MovieReviews:', authState);
        console.log('User ID:', userId);
    }, [authState, userId]);

    const colors = {
        primary: '#4682B4',
        secondary: '#FFD700',
        accent: '#4FD8DE',
        success: '#7FBA7A',
        warning: '#FFCE73',
        background: {
            dark: '#1A1A1A',
            light: '#ffffff',
        },
        text: {
            primary: '#ffffff',
            secondary: 'rgba(255, 255, 255, 0.7)',
        },
        grid: 'rgba(255, 255, 255, 0.07)',
    };

    const fetchReviews = async () => {
        setLoading(true);
        setError(null);
        try {
            // First try to get reviews from localStorage to maintain persistence
            const savedReviews = JSON.parse(localStorage.getItem(`reviews-${movieId}`) || '[]');

            // Then fetch from service
            const response = await reviewService.getMovieReviews(movieId, page, limit);

            // Combine saved reviews with fetched reviews, avoiding duplicates
            const combinedReviews = [...savedReviews];

            // Add fetched reviews that aren't already in savedReviews
            response.reviews.forEach((fetchedReview) => {
                if (!combinedReviews.some(r => r._id === fetchedReview._id)) {
                    combinedReviews.push(fetchedReview);
                }
            });

            // Sort by date, newest first
            combinedReviews.sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );

            setReviews((prev) => (page === 1 ? combinedReviews : [...prev, ...combinedReviews]));
            setTotalReviews(combinedReviews.length);
        } catch (err: any) {
            setError(err.message || 'Failed to load reviews. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const newSocket = io('http://localhost:5000', {
            withCredentials: true,
        });
        setSocket(newSocket);

        newSocket.emit('joinMovie', movieId);

        newSocket.on('reviewAdded', (newReview: Review) => {
            setReviews((prev) => {
                if (prev.some((r) => r._id === newReview._id)) {
                    return prev;
                }
                return [newReview, ...prev];
            });
            setTotalReviews((prev) => prev + 1);
        });

        newSocket.on('reviewUpdated', (updatedReview: Review) => {
            setReviews((prev) =>
                prev.map((r) => (r._id === updatedReview._id ? updatedReview : r))
            );
        });

        newSocket.on('reviewDeleted', (reviewId: string) => {
            setReviews((prev) => prev.filter((r) => r._id !== reviewId));
            setTotalReviews((prev) => prev - 1);
        });

        fetchReviews();

        const pollingInterval = setInterval(fetchReviews, 30000);

        return () => {
            newSocket.disconnect();
            clearInterval(pollingInterval);
        };
    }, [movieId, page]);

    const overallRating = reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0;
    const sentiment =
        overallRating >= 4 ? 'Highly Positive' : overallRating >= 3 ? 'Mixed' : 'Critical';

    const handleRatingChange = (event: React.ChangeEvent<{}>, value: number | null) => {
        if (editReview) {
            setEditReview((prev) => prev && { ...prev, rating: value || 0 });
        } else {
            setNewReview((prev) => ({ ...prev, rating: value || 0 }));
        }
    };

    const handleContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (editReview) {
            setEditReview((prev) => prev && { ...prev, content: event.target.value });
        } else {
            setNewReview((prev) => ({ ...prev, content: event.target.value }));
        }
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if (!userId) {
            setError('You must be logged in to submit a review.');
            return;
        }

        const reviewData = editReview || newReview;
        if (reviewData.rating < 1 || reviewData.rating > 5 || !reviewData.content.trim()) {
            setError('Please provide a rating (1-5) and a review comment.');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            // Create a custom review with the current user information
            if (editReview) {
                const updatedReview = await reviewService.updateReview(editReview._id, {
                    rating: reviewData.rating,
                    content: reviewData.content,
                });

                // Override with real user data since we're using mock data
                const enhancedReview = {
                    ...updatedReview,
                    user: {
                        id: userId,
                        username: authState.user?.username || 'Anonymous',
                        email: authState.user?.email || '',
                        profilePicture: '', // Remove mock profile picture
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    },
                    createdAt: editReview.createdAt,
                    updatedAt: new Date().toISOString(),
                    likes: editReview.likes || []
                };

                // Update the review in localStorage
                const savedReviews = JSON.parse(localStorage.getItem(`reviews-${movieId}`) || '[]');
                const updatedSavedReviews = savedReviews.map((r: Review) =>
                    r._id === enhancedReview._id ? enhancedReview : r
                );
                localStorage.setItem(`reviews-${movieId}`, JSON.stringify(updatedSavedReviews));

                setReviews((prev) =>
                    prev.map((r) => (r._id === enhancedReview._id ? enhancedReview : r))
                );

                if (socket) {
                    socket.emit('reviewUpdated', enhancedReview);
                }
                setEditReview(null);
            } else {
                const createdReview = await reviewService.createReview(movieId, reviewData);

                // Override with real user data since we're using mock data
                const enhancedReview = {
                    ...createdReview,
                    _id: `review-${Date.now()}`, // Ensure unique ID
                    user: {
                        id: userId,
                        username: authState.user?.username || 'Anonymous',
                        email: authState.user?.email || '',
                        profilePicture: '', // Remove mock profile picture
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    },
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    likes: []
                };

                // Save to localStorage to persist the reviews
                const savedReviews = JSON.parse(localStorage.getItem(`reviews-${movieId}`) || '[]');
                localStorage.setItem(`reviews-${movieId}`, JSON.stringify([enhancedReview, ...savedReviews]));

                setReviews((prev) => [enhancedReview, ...prev]);
                setTotalReviews((prev) => prev + 1);

                if (socket) {
                    socket.emit('reviewAdded', movieId, enhancedReview);
                }
                setNewReview({ rating: 0, content: '' });
            }
        } catch (err: any) {
            setError(err.message || (editReview ? 'Failed to update review.' : 'Failed to submit review.'));
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (reviewId: string) => {
        if (!userId) {
            setError('You must be logged in to like reviews.');
            return;
        }

        try {
            // Instead of using the service which uses mock data, we'll handle likes directly
            setReviews((prev) => {
                return prev.map(review => {
                    if (review._id === reviewId) {
                        const likes = [...(review.likes || [])];
                        const userIndex = likes.indexOf(userId);

                        if (userIndex === -1) {
                            // Add like
                            likes.push(userId);
                        } else {
                            // Remove like
                            likes.splice(userIndex, 1);
                        }

                        // Save updated reviews to localStorage
                        const savedReviews = JSON.parse(localStorage.getItem(`reviews-${movieId}`) || '[]');
                        const updatedSavedReviews = savedReviews.map((r: Review) =>
                            r._id === reviewId ? { ...r, likes } : r
                        );
                        localStorage.setItem(`reviews-${movieId}`, JSON.stringify(updatedSavedReviews));

                        return { ...review, likes };
                    }
                    return review;
                });
            });
        } catch (err: any) {
            setError(err.message || 'Failed to like/unlike review.');
        }
    };

    const handleEdit = (review: Review) => {
        setEditReview(review);
        setNewReview({ rating: review.rating, content: review.content });
    };

    const handleDelete = async (reviewId: string) => {
        try {
            await reviewService.deleteReview(reviewId);

            // Remove the review from localStorage to ensure it stays deleted after refresh
            const savedReviews = JSON.parse(localStorage.getItem(`reviews-${movieId}`) || '[]');
            const updatedSavedReviews = savedReviews.filter((r: Review) => r._id !== reviewId);
            localStorage.setItem(`reviews-${movieId}`, JSON.stringify(updatedSavedReviews));

            setReviews((prev) => prev.filter((r) => r._id !== reviewId));
            setTotalReviews((prev) => prev - 1);

            if (socket) {
                socket.emit('reviewDeleted', reviewId, movieId);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to delete review.');
        }
    };

    const handleLoadMore = () => {
        setPage((prev) => prev + 1);
    };

    return (
        <Container>
            <Typography
                variant="h6"
                gutterBottom
                sx={{
                    color: colors.text.primary,
                    fontWeight: 500,
                    fontFamily: 'Roboto, sans-serif',
                    zIndex: 1,
                    position: 'relative',
                }}
            >
                User Reviews
            </Typography>

            {/* Debug information - remove this in production */}
            {/* <Box sx={{ mb: 2, p: 2, backgroundColor: 'rgba(255,255,0,0.1)', borderRadius: 1 }}>
                <Typography variant="body2" color="textSecondary">
                    Login status: {currentUserId ? 'Logged in' : 'Not logged in'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    User ID: {currentUserId || 'none'}
                </Typography>
            </Box> */}

            <ReviewFormContainer>
                <form onSubmit={handleSubmit}>
                    <Typography
                        variant="subtitle2"
                        sx={{
                            color: colors.text.primary,
                            mb: 2,
                            fontFamily: 'Roboto, sans-serif',
                        }}
                    >
                        {editReview ? 'Edit Your Review' : 'Write a Review'}
                    </Typography>
                    {!userId && (
                        <Typography
                            variant="body2"
                            sx={{
                                color: colors.warning,
                                mb: 2,
                                backgroundColor: 'rgba(255, 206, 115, 0.1)',
                                p: 1,
                                borderRadius: 1,
                                border: '1px solid rgba(255, 206, 115, 0.3)'
                            }}
                        >
                            Please log in to submit your review
                        </Typography>
                    )}
                    <Box sx={{ mb: 2 }}>
                        <Typography
                            component="legend"
                            sx={{
                                color: colors.text.secondary,
                                mb: 1,
                                fontSize: '0.875rem',
                            }}
                        >
                            Your Rating
                        </Typography>
                        <Rating
                            name="rating"
                            value={editReview ? editReview.rating : newReview.rating}
                            onChange={handleRatingChange}
                            precision={0.5}
                            disabled={!userId}
                            sx={{
                                color: colors.secondary,
                                '& .MuiRating-iconEmpty': {
                                    color: 'rgba(255, 255, 255, 0.3)',
                                },
                            }}
                        />
                    </Box>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        placeholder={userId ? "Share your thoughts about the movie..." : "Log in to write a review"}
                        value={editReview ? editReview.content : newReview.content}
                        onChange={handleContentChange}
                        disabled={!userId}
                        sx={{
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                                color: colors.text.primary,
                                '& fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.23)',
                                },
                                '&:hover fieldset': {
                                    borderColor: colors.primary,
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: colors.primary,
                                },
                            },
                        }}
                    />
                    {error && (
                        <Typography
                            color="error"
                            variant="body2"
                            sx={{ mb: 2 }}
                        >
                            {error}
                        </Typography>
                    )}
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading || !userId}
                            sx={{
                                bgcolor: colors.primary,
                                '&:hover': {
                                    bgcolor: colors.accent,
                                },
                            }}
                        >
                            {loading
                                ? 'Submitting...'
                                : editReview
                                    ? 'Update Review'
                                    : 'Submit Review'}
                        </Button>
                        {editReview && (
                            <Button
                                onClick={() => {
                                    setEditReview(null);
                                    setNewReview({ rating: 0, content: '' });
                                }}
                                variant="outlined"
                                sx={{
                                    color: colors.text.secondary,
                                    borderColor: colors.text.secondary,
                                    '&:hover': {
                                        borderColor: colors.primary,
                                        color: colors.primary,
                                    },
                                }}
                            >
                                Cancel
                            </Button>
                        )}
                    </Box>
                </form>
            </ReviewFormContainer>

            {reviews.length > 0 && (
                <>
                    <OverallReviewCard sx={{ mb: 3 }}>
                        <Typography
                            variant="subtitle2"
                            sx={{
                                color: colors.text.primary,
                                fontFamily: 'Roboto, sans-serif',
                                mb: 1.5,
                            }}
                        >
                            Overall User Rating
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Box sx={{ position: 'relative', display: 'inline-flex', mr: 2 }}>
                                <RatingIndicator value={overallRating}>
                                    {overallRating.toFixed(1)}
                                </RatingIndicator>
                            </Box>
                            <Box>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: colors.text.primary,
                                        fontFamily: 'Roboto, sans-serif',
                                    }}
                                >
                                    {overallRating.toFixed(1)}/5
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: colors.text.secondary,
                                        fontFamily: 'Roboto, sans-serif',
                                    }}
                                >
                                    Based on {totalReviews} user review{totalReviews !== 1 ? 's' : ''}
                                </Typography>
                                <SentimentBadge sentiment={sentiment} sx={{ mt: 1 }}>
                                    {sentiment}
                                </SentimentBadge>
                            </Box>
                        </Box>
                    </OverallReviewCard>
                    <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                </>
            )}

            {loading && reviews.length === 0 ? (
                <Typography sx={{ color: colors.text.secondary }}>
                    Loading reviews...
                </Typography>
            ) : reviews.length === 0 ? (
                <Typography sx={{ color: colors.text.secondary }}>
                    No reviews yet. Be the first to add one!
                </Typography>
            ) : (
                <>
                    {reviews.map((review) => (
                        <ReviewItem key={review._id}>
                            <Avatar
                                src={review.user.profilePicture || ''}
                                alt={review.user.username}
                                sx={{
                                    width: 40,
                                    height: 40,
                                    mr: 2,
                                    bgcolor: colors.primary,
                                    color: colors.text.primary,
                                    fontWeight: 'bold'
                                }}
                            >
                                {review.user.username ? review.user.username.charAt(0).toUpperCase() : 'A'}
                            </Avatar>
                            <Box sx={{ flexGrow: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{ color: colors.text.primary }}
                                    >
                                        {review.user.username}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Rating
                                            value={review.rating}
                                            readOnly
                                            precision={0.5}
                                            size="small"
                                            sx={{
                                                color: colors.secondary,
                                                '& .MuiRating-iconEmpty': {
                                                    color: 'rgba(255, 255, 255, 0.3)',
                                                },
                                            }}
                                        />
                                        <Typography
                                            variant="body2"
                                            sx={{ color: colors.text.secondary }}
                                        >
                                            {review.rating}/5
                                        </Typography>
                                    </Box>
                                </Box>
                                <Typography
                                    variant="body2"
                                    sx={{ color: colors.text.secondary, mb: 1 }}
                                >
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{ color: colors.text.primary }}
                                >
                                    {review.content}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <IconButton
                                            onClick={() => handleLike(review._id)}
                                            sx={{
                                                color: review.likes?.includes(userId || '')
                                                    ? colors.primary
                                                    : colors.text.secondary,
                                            }}
                                            disabled={!userId}
                                        >
                                            <ThumbUpIcon fontSize="small" />
                                        </IconButton>
                                        <Typography
                                            variant="caption"
                                            sx={{ color: colors.text.secondary }}
                                        >
                                            {review.likes?.length || 0} likes
                                        </Typography>
                                    </Box>
                                    {userId === review.user.id && (
                                        <>
                                            <IconButton
                                                onClick={() => handleEdit(review)}
                                                sx={{ color: colors.text.secondary }}
                                            >
                                                <Edit fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => handleDelete(review._id)}
                                                sx={{ color: colors.text.secondary }}
                                            >
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </>
                                    )}
                                </Box>
                            </Box>
                        </ReviewItem>
                    ))}
                    {reviews.length < totalReviews && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                            <Button
                                variant="outlined"
                                onClick={handleLoadMore}
                                disabled={loading}
                                sx={{
                                    color: colors.text.secondary,
                                    borderColor: colors.text.secondary,
                                    '&:hover': {
                                        borderColor: colors.primary,
                                        color: colors.primary,
                                    },
                                }}
                            >
                                {loading ? 'Loading...' : 'Load More'}
                            </Button>
                        </Box>
                    )}
                </>
            )}
        </Container>
    );
};

export default MovieReviews;