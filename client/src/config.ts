// API configuration
export const API_URL = process.env.REACT_APP_API_URL || 'https://moviereviewaggregator.onrender.com/api';

// Image configuration for TMDB API
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

// Default image paths
export const DEFAULT_POSTER = '/images/default-poster.png';
export const DEFAULT_BACKDROP = '/images/default-backdrop.jpg';
export const DEFAULT_PROFILE = '/images/default-profile.png';

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 20;

// Theme settings
export const THEME_STORAGE_KEY = 'movieReviews-theme';

// Auth settings
export const TOKEN_STORAGE_KEY = 'movieReviews-token';
export const USER_STORAGE_KEY = 'movieReviews-user';

// Feature flags
export const FEATURES = {
    ENABLE_REVIEWS: true,
    ENABLE_WATCHLIST: true,
    ENABLE_DARK_MODE: true,
}; 
