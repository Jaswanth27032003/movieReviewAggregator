const axios = require('axios');

// TMDB API base URL
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.TMDB_API_KEY;

// Get trending movies
exports.getTrendingMovies = async (req, res) => {
    try {
        const response = await axios.get(
            `${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`
        );

        res.json(response.data.results.slice(0, 10));
    } catch (error) {
        console.error('Error fetching trending movies:', error.message);
        res.status(500).json({ message: 'Error fetching trending movies' });
    }
};

// Get trending TV shows
exports.getTrendingTVShows = async (req, res) => {
    try {
        const response = await axios.get(
            `${TMDB_BASE_URL}/trending/tv/week?api_key=${TMDB_API_KEY}`
        );

        res.json(response.data.results.slice(0, 10));
    } catch (error) {
        console.error('Error fetching trending TV shows:', error.message);
        res.status(500).json({ message: 'Error fetching trending TV shows' });
    }
};

// Get top rated movies
exports.getTopRatedMovies = async (req, res) => {
    try {
        const response = await axios.get(
            `${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}`
        );

        res.json(response.data.results.slice(0, 10));
    } catch (error) {
        console.error('Error fetching top rated movies:', error.message);
        res.status(500).json({ message: 'Error fetching top rated movies' });
    }
};

// Get top rated TV shows
exports.getTopRatedTVShows = async (req, res) => {
    try {
        const response = await axios.get(
            `${TMDB_BASE_URL}/tv/top_rated?api_key=${TMDB_API_KEY}`
        );

        res.json(response.data.results.slice(0, 10));
    } catch (error) {
        console.error('Error fetching top rated TV shows:', error.message);
        res.status(500).json({ message: 'Error fetching top rated TV shows' });
    }
};

// Search movies and TV shows
exports.search = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        const response = await axios.get(
            `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${query}`
        );

        res.json(response.data.results);
    } catch (error) {
        console.error('Error searching:', error.message);
        res.status(500).json({ message: 'Error searching' });
    }
};

// Get movie details with external ratings
exports.getMovieDetails = async (req, res) => {
    try {
        const { id } = req.params;

        // Get movie details
        const movieResponse = await axios.get(
            `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos,reviews,similar`
        );

        // Get external IDs for the movie
        const externalIdsResponse = await axios.get(
            `${TMDB_BASE_URL}/movie/${id}/external_ids?api_key=${TMDB_API_KEY}`
        );

        // Get external ratings
        const externalRatings = await getExternalRatings(id, externalIdsResponse.data);

        res.json({
            ...movieResponse.data,
            external_ids: externalIdsResponse.data,
            external_ratings: externalRatings
        });
    } catch (error) {
        console.error('Error fetching movie details:', error.message);
        res.status(500).json({ message: 'Error fetching movie details' });
    }
};

// Get TV show details with external ratings
exports.getTVShowDetails = async (req, res) => {
    try {
        const { id } = req.params;

        // Get TV show details
        const tvResponse = await axios.get(
            `${TMDB_BASE_URL}/tv/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos,reviews,similar`
        );

        // Get external IDs for the TV show
        const externalIdsResponse = await axios.get(
            `${TMDB_BASE_URL}/tv/${id}/external_ids?api_key=${TMDB_API_KEY}`
        );

        // Get external ratings
        const externalRatings = await getExternalRatings(id, externalIdsResponse.data, 'tv');

        res.json({
            ...tvResponse.data,
            external_ids: externalIdsResponse.data,
            external_ratings: externalRatings
        });
    } catch (error) {
        console.error('Error fetching TV show details:', error.message);
        res.status(500).json({ message: 'Error fetching TV show details' });
    }
};

// Helper function to get external ratings
const getExternalRatings = async (id, externalIds, type = 'movie') => {
    try {
        const ratings = {
            imdb: null,
            rottenTomatoes: null,
            metacritic: null,
            tmdb: null
        };

        // Get TMDB rating
        const tmdbResponse = await axios.get(
            `${TMDB_BASE_URL}/${type}/${id}?api_key=${TMDB_API_KEY}`
        );

        ratings.tmdb = {
            score: tmdbResponse.data.vote_average,
            votes: tmdbResponse.data.vote_count,
            url: `https://www.themoviedb.org/${type}/${id}`
        };

        // Get IMDB rating if available
        if (externalIds.imdb_id) {
            try {
                // This is a placeholder. In a real app, you would use a service like OMDB API
                // to get IMDB ratings, but that requires another API key
                ratings.imdb = {
                    score: null,
                    url: `https://www.imdb.com/title/${externalIds.imdb_id}`
                };
            } catch (error) {
                console.error('Error fetching IMDB rating:', error.message);
            }
        }

        // Note: For Rotten Tomatoes and Metacritic, you would need to use web scraping
        // or a third-party API service as they don't provide free public APIs

        return ratings;
    } catch (error) {
        console.error('Error fetching external ratings:', error.message);
        return {};
    }
}; 