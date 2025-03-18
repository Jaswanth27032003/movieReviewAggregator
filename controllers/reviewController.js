const Review = require('../models/Review');
const User = require('../models/user');

// Get all reviews for a movie
exports.getMovieReviews = async (req, res) => {
    try {
        const { movieId } = req.params;

        const reviews = await Review.find({ movieId })
            .sort({ createdAt: -1 })
            .populate('user', 'username profilePicture');

        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error.message);
        res.status(500).json({ message: 'Error fetching reviews' });
    }
};

// Create a new review
exports.createReview = async (req, res) => {
    try {
        const { movieId, rating, content } = req.body;

        // Check if user already reviewed this movie
        const existingReview = await Review.findOne({
            user: req.user.id,
            movieId
        });

        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this movie' });
        }

        // Create new review
        const review = new Review({
            user: req.user.id,
            movieId,
            rating,
            content
        });

        // Save review to database
        await review.save();

        // Populate user data
        await review.populate('user', 'username profilePicture');

        res.json(review);
    } catch (error) {
        console.error('Error creating review:', error.message);
        res.status(500).json({ message: 'Error creating review' });
    }
};

// Update a review
exports.updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, content } = req.body;

        // Find review
        let review = await Review.findById(id);

        // Check if review exists
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if user owns the review
        if (review.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to update this review' });
        }

        // Update review
        review.rating = rating;
        review.content = content;

        // Save updated review
        await review.save();

        // Populate user data
        await review.populate('user', 'username profilePicture');

        res.json(review);
    } catch (error) {
        console.error('Error updating review:', error.message);
        res.status(500).json({ message: 'Error updating review' });
    }
};

// Delete a review
exports.deleteReview = async (req, res) => {
    try {
        const { id } = req.params;

        // Find review
        const review = await Review.findById(id);

        // Check if review exists
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if user owns the review or is admin
        if (review.user.toString() !== req.user.id && !req.user.isAdmin) {
            return res.status(401).json({ message: 'Not authorized to delete this review' });
        }

        // Delete review
        await review.remove();

        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Error deleting review:', error.message);
        res.status(500).json({ message: 'Error deleting review' });
    }
};

// Like a review
exports.likeReview = async (req, res) => {
    try {
        const { id } = req.params;

        // Find review
        const review = await Review.findById(id);

        // Check if review exists
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if user already liked the review
        if (review.likes.includes(req.user.id)) {
            // Remove like
            review.likes = review.likes.filter(
                like => like.toString() !== req.user.id
            );
        } else {
            // Add like
            review.likes.push(req.user.id);
        }

        // Save updated review
        await review.save();

        res.json(review.likes);
    } catch (error) {
        console.error('Error liking review:', error.message);
        res.status(500).json({ message: 'Error liking review' });
    }
};

// Get user reviews
exports.getUserReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .populate('user', 'username profilePicture');

        res.json(reviews);
    } catch (error) {
        console.error('Error fetching user reviews:', error.message);
        res.status(500).json({ message: 'Error fetching user reviews' });
    }
}; 