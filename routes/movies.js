const express = require('express');
const router = express.Router();
const {
    getTrendingMovies,
    getTrendingTVShows,
    getTopRatedMovies,
    getTopRatedTVShows,
    search,
    getMovieDetails,
    getTVShowDetails
} = require('../controllers/movieController');

// @route   GET /api/movies/trending/movies
// @desc    Get trending movies
// @access  Public
router.get('/trending/movies', getTrendingMovies);

// @route   GET /api/movies/trending/tv
// @desc    Get trending TV shows
// @access  Public
router.get('/trending/tv', getTrendingTVShows);

// @route   GET /api/movies/top-rated/movies
// @desc    Get top rated movies
// @access  Public
router.get('/top-rated/movies', getTopRatedMovies);

// @route   GET /api/movies/top-rated/tv
// @desc    Get top rated TV shows
// @access  Public
router.get('/top-rated/tv', getTopRatedTVShows);

// @route   GET /api/movies/search
// @desc    Search movies and TV shows
// @access  Public
router.get('/search', search);

// @route   GET /api/movies/movie/:id
// @desc    Get movie details
// @access  Public
router.get('/movie/:id', getMovieDetails);

// @route   GET /api/movies/tv/:id
// @desc    Get TV show details
// @access  Public
router.get('/tv/:id', getTVShowDetails);

module.exports = router; 