import React, { useState } from 'react';
import {
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Typography,
    Rating,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    TextField,
    Chip
} from '@mui/material';
import {
    MoreVert,
    ThumbUp,
    ThumbUpOutlined,
    Edit,
    Delete,
    Star
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Review, ReviewFormData } from '../../types';
import { formatDate } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import { updateReview, deleteReview, likeReview } from '../../services/reviewService';

interface ReviewItemProps {
    review: Review;
    onReviewUpdated: (review: Review) => void;
    onReviewDeleted: (reviewId: string) => void;
}

const ReviewContent = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
}));

const ReviewActions = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1)
}));

const ReviewItem: React.FC<ReviewItemProps> = ({ review, onReviewUpdated, onReviewDeleted }) => {
    const { state } = useAuth();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editFormData, setEditFormData] = useState<ReviewFormData>({
        rating: review.rating,
        content: review.content
    });
    const [isLiked, setIsLiked] = useState(review.likes?.includes(state.user?.id || '') || false);
    const [likeCount, setLikeCount] = useState(review.likes?.length || 0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Check if the current user is the author of the review
    const isCurrentUserReview = state.isAuthenticated &&
        state.user?.id &&
        typeof review.user !== 'string' &&
        review.user.id === state.user.id;

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEditClick = () => {
        handleMenuClose();
        setEditDialogOpen(true);
    };

    const handleDeleteClick = () => {
        handleMenuClose();
        setDeleteDialogOpen(true);
    };

    const handleEditDialogClose = () => {
        setEditDialogOpen(false);
        // Reset form data
        setEditFormData({
            rating: review.rating,
            content: review.content
        });
    };

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
    };

    const handleRatingChange = (event: React.SyntheticEvent, newValue: number | null) => {
        setEditFormData({
            ...editFormData,
            rating: newValue || 0
        });
    };

    const handleContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditFormData({
            ...editFormData,
            content: event.target.value
        });
    };

    const handleLikeClick = async () => {
        if (!state.isAuthenticated) {
            // Redirect to login page if not authenticated
            window.location.href = '/login';
            return;
        }

        try {
            setIsSubmitting(true);
            // The likeReview function now returns a complete Review object
            const updatedReview = await likeReview(review._id);
            // Update local state for immediate UI feedback
            setIsLiked(!isLiked);
            setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
            // Pass the updated review to the parent component
            onReviewUpdated(updatedReview);
        } catch (error) {
            console.error('Error liking review:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditSubmit = async () => {
        try {
            setIsSubmitting(true);
            const updatedReview = await updateReview(review._id, editFormData);
            onReviewUpdated(updatedReview);
            setEditDialogOpen(false);
        } catch (error) {
            console.error('Error updating review:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            setIsSubmitting(true);
            await deleteReview(review._id);
            onReviewDeleted(review._id);
            setDeleteDialogOpen(false);
        } catch (error) {
            console.error('Error deleting review:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const username = typeof review.user === 'string'
        ? 'Unknown User'
        : review.user.username;

    const profilePicture = typeof review.user === 'string'
        ? ''
        : review.user.profilePicture;

    return (
        <ListItem alignItems="flex-start" sx={{ flexDirection: 'column', py: 2 }}>
            <Box sx={{ display: 'flex', width: '100%' }}>
                <ListItemAvatar>
                    <Avatar src={profilePicture} alt={username}>
                        {username.charAt(0).toUpperCase()}
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={
                        <Box
                            component="div"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: '100%'
                            }}
                        >
                            {/* Username Section */}
                            <Box component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="subtitle1" component="span">
                                    {username}
                                </Typography>
                                {isCurrentUserReview && (
                                    <IconButton edge="end" onClick={handleMenuOpen} size="small" sx={{ ml: 1 }}>
                                        <MoreVert />
                                    </IconButton>
                                )}
                            </Box>

                            {/* Rating & Date Section */}
                            <Box component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                                <Rating
                                    value={review.rating}
                                    readOnly
                                    size="small"
                                    precision={0.5}
                                />
                                <Typography
                                    variant="body2"
                                    component="span"
                                    sx={{ ml: 1, color: 'text.secondary' }}
                                >
                                    {formatDate(review.createdAt)}
                                </Typography>
                            </Box>
                        </Box>
                    }
                    secondary={
                        <Box component="div" sx={{ mt: 0.5 }}>
                            {/* Review Content */}
                            <Typography
                                variant="body2"
                                component="div"  // Changed to div to avoid nested <p>
                                sx={{
                                    display: 'inline',
                                    color: 'text.primary'
                                }}
                            >
                                {review.content}
                            </Typography>

                            {/* Edit Indicator */}
                            {review.createdAt !== review.updatedAt && (
                                <Chip
                                    label="Edited"
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                        mt: 0.5,
                                        height: 20,
                                        fontSize: '0.7rem',
                                        color: 'text.secondary',
                                        borderColor: 'divider'
                                    }}
                                />
                            )}
                        </Box>
                    }
                    disableTypography // Add this prop to prevent default <p> usage
                />

                {/* Move Menu outside the ListItemText */}
                {isCurrentUserReview && (
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        <MenuItem onClick={handleEditClick}>
                            <Edit fontSize="small" sx={{ mr: 1 }} />
                            Edit
                        </MenuItem>
                        <MenuItem onClick={handleDeleteClick}>
                            <Delete fontSize="small" sx={{ mr: 1 }} />
                            Delete
                        </MenuItem>
                    </Menu>
                )}
            </Box>

            <ReviewContent>
                <Typography variant="body1">{review.content}</Typography>
            </ReviewContent>

            <ReviewActions>
                <IconButton
                    size="small"
                    onClick={handleLikeClick}
                    color={isLiked ? 'primary' : 'default'}
                >
                    {isLiked ? <ThumbUp fontSize="small" /> : <ThumbUpOutlined fontSize="small" />}
                </IconButton>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                    {likeCount}
                </Typography>
            </ReviewActions>

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onClose={handleEditDialogClose} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Your Review</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <Typography component="legend" gutterBottom>
                            Your Rating
                        </Typography>
                        <Rating
                            name="edit-rating"
                            value={editFormData.rating}
                            onChange={handleRatingChange}
                            precision={0.5}
                            size="large"
                        />
                    </Box>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Your Review"
                        value={editFormData.content}
                        onChange={handleContentChange}
                        variant="outlined"
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditDialogClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleEditSubmit}
                        color="primary"
                        variant="contained"
                        disabled={isSubmitting}
                    >
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
                <DialogTitle>Delete Review</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this review? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteDialogClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        color="error"
                        variant="contained"
                        disabled={isSubmitting}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </ListItem>
    );
};

export default ReviewItem; 