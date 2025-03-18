const express = require('express');
const router = express.Router();
const {
    getMovieReviews,
    createReview,
    updateReview,
    deleteReview,
    likeReview,
    getUserReviews
} = require('../controllers/reviewController');
const { auth } = require('../middleware/auth');

// @route   GET /api/reviews/movie/:movieId
// @desc    Get all reviews for a movie
// @access  Public
router.get('/movie/:movieId', getMovieReviews);

// @route   POST /api/reviews
// @desc    Create a new review
// @access  Private
router.post('/', auth, createReview);

// @route   PUT /api/reviews/:id
// @desc    Update a review
// @access  Private
router.put('/:id', auth, updateReview);

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private
router.delete('/:id', auth, deleteReview);

// @route   PUT /api/reviews/like/:id
// @desc    Like or unlike a review
// @access  Private
router.put('/like/:id', auth, likeReview);

// @route   GET /api/reviews/user
// @desc    Get user reviews
// @access  Private
router.get('/user', auth, getUserReviews);

module.exports = router; 