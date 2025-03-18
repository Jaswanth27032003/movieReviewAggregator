import { Movie } from '../types';

/**
 * Format a date string to a more readable format
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "Jan 1, 2023")
 */
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

/**
 * Format minutes to hours and minutes
 * @param minutes - Runtime in minutes
 * @returns Formatted runtime (e.g., "2h 15m")
 */
export const formatRuntime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) {
        return `${mins}m`;
    }

    if (mins === 0) {
        return `${hours}h`;
    }

    return `${hours}h ${mins}m`;
};

/**
 * Format a number to display with commas
 * @param num - Number to format
 * @returns Formatted number with commas (e.g., "1,234,567")
 */
export const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Get the full image URL for TMDB images
 * @param path - Image path from TMDB
 * @param size - Size of the image (default: 'original')
 * @returns Full image URL
 */
export const getImageUrl = (path: string | null, size: string = 'original'): string => {
    if (!path) return '/images/placeholder.png';
    return `https://image.tmdb.org/t/p/${size}${path}`;
};

/**
 * Format a date to year only
 * @param dateString - ISO date string
 * @returns Year only (e.g., "2023")
 */
export const formatYear = (dateString: string | undefined): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.getFullYear().toString();
};

/**
 * Truncate text to a specified length
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
};

// Get YouTube video URL
export const getYouTubeUrl = (key: string): string => {
    return `https://www.youtube.com/embed/${key}`;
};

// Get movie title
export const getTitle = (item: Movie): string => {
    return item.title || 'Unknown Title';
};

// Get movie release date
export const getReleaseDate = (item: Movie): string => {
    return item.release_date ? formatDate(item.release_date) : '';
};

// Calculate average rating from external sources and reviews
export const calculateAverageRating = (movie: Movie): number => {
    // If we have external ratings, use them
    if (movie.external_ratings) {
        const ratings: number[] = [];

        // Add TMDB rating if available
        if (movie.external_ratings.tmdb?.score) {
            ratings.push(movie.external_ratings.tmdb.score);
        }

        // Add IMDB rating if available
        if (movie.external_ratings.imdb?.score) {
            ratings.push(movie.external_ratings.imdb.score);
        }

        // Add Rotten Tomatoes rating if available (convert to scale of 10)
        if (movie.external_ratings.rottenTomatoes?.score) {
            ratings.push(movie.external_ratings.rottenTomatoes.score / 10);
        }

        // Add Metacritic rating if available (convert to scale of 10)
        if (movie.external_ratings.metacritic?.score) {
            ratings.push(movie.external_ratings.metacritic.score / 10);
        }

        // Calculate average
        if (ratings.length > 0) {
            const sum = ratings.reduce((acc, rating) => acc + rating, 0);
            return parseFloat((sum / ratings.length).toFixed(1));
        }
    }

    // If no external ratings, use TMDB rating
    return movie.vote_average || 0;
}; 