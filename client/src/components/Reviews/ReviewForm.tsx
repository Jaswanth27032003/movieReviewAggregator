import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Rating,
    Typography,
    Alert,
    CircularProgress
} from '@mui/material';
import { Star } from '@mui/icons-material';
import { ReviewFormData, Review } from '../../types';
import { createReview } from '../../services/reviewService';

interface ReviewFormProps {
    mediaId: string;
    mediaType: 'movie' | 'tv'
    onReviewAdded: (review: Review) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ mediaType, onReviewAdded }) => {
    const [formData, setFormData] = useState<ReviewFormData>({
        rating: 0,
        content: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleRatingChange = (event: React.SyntheticEvent, newValue: number | null) => {
        setFormData({
            ...formData,
            rating: newValue || 0
        });
    };

    const handleContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            content: event.target.value
        });
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Validate form
        if (formData.rating === 0) {
            setError('Please select a rating');
            return;
        }

        if (formData.content.trim().length < 5) {
            setError('Review content must be at least 5 characters');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const newReview = await createReview(mediaType, formData);

            // Reset form
            setFormData({
                rating: 0,
                content: ''
            });

            setSuccess(true);
            onReviewAdded(newReview);

            // Hide success message after 3 seconds
            setTimeout(() => {
                setSuccess(false);
            }, 3000);
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    Your review has been submitted successfully!
                </Alert>
            )}

            <Box sx={{ mb: 3 }}>
                <Typography component="legend" gutterBottom>
                    Your Rating
                </Typography>
                <Rating
                    name="rating"
                    value={formData.rating}
                    onChange={handleRatingChange}
                    precision={0.5}
                    size="large"
                    emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />}
                />
            </Box>

            <TextField
                fullWidth
                multiline
                rows={4}
                label="Your Review"
                value={formData.content}
                onChange={handleContentChange}
                variant="outlined"
                placeholder="Share your thoughts about this movie..."
                sx={{ mb: 2 }}
            />

            <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{ mt: 1 }}
            >
                {loading ? <CircularProgress size={24} /> : 'Submit Review'}
            </Button>
        </Box>
    );
};

export default ReviewForm; 