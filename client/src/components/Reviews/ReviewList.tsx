import React, { useState, useEffect } from 'react';
import {
    Box,
    List,
    Typography,
    Divider,
    CircularProgress,
    Alert,
    Pagination,
} from '@mui/material';
import { Review } from '../../types';
import { getMovieReviews } from '../../services/reviewService';
import ReviewItem from './ReviewItem';

interface ReviewListProps {
    mediaId: string;
    movieId?: string
    mediaType: 'movie' | 'tv';
    limit?: number;
    reviews: Review[];
    loading?: boolean;
    onReviewDeleted: (reviewId: string) => void;
    onReviewUpdated: (updatedReview: Review) => void;


}

interface ReviewResponse {
    reviews: Review[];
    total: number;
}

const ReviewList: React.FC<ReviewListProps> = ({ movieId, limit }) => {

    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = limit || 5;

    const fetchReviews = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await getMovieReviews(movieId ?? '', page, pageSize);

            // Handle the response which now includes reviews and total count
            setReviews(response.reviews);
            setTotalPages(Math.ceil(response.total / pageSize));
        } catch (err) {
            console.error('Error fetching reviews:', err);
            setError('Failed to load reviews. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [movieId, page, pageSize]);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const handleReviewUpdated = (updatedReview: Review) => {
        setReviews(prevReviews =>
            prevReviews.map(review =>
                review._id === updatedReview._id ? updatedReview : review
            )
        );
    };

    const handleReviewDeleted = (reviewId: string) => {
        setReviews(prevReviews => prevReviews.filter(review => review._id !== reviewId));
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ my: 2 }}>
                {error}
            </Alert>
        );
    }

    if (reviews.length === 0) {
        return (
            <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">
                    No reviews yet. Be the first to share your thoughts!
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <List disablePadding>
                {reviews.map((review, index) => (
                    <React.Fragment key={review._id}>
                        <ReviewItem
                            review={review}
                            onReviewUpdated={handleReviewUpdated}
                            onReviewDeleted={handleReviewDeleted}
                        />
                        {index < reviews.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                ))}
            </List>

            {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        showFirstButton
                        showLastButton
                    />
                </Box>
            )}
        </Box>
    );
};

export default ReviewList; 