import axios from "axios";

const API_KEY = '849760be7112c5ccb4fb93b27df41690';
const BASE_URL = 'https://api.themoviedb.org/3';


// Types
export interface Movie {
    id: number;
    title: string;
    poster_path: string;
    backdrop_path: string;
    overview: string;
    release_date: string;
    vote_average: number;
    vote_count: number;
    // Add other properties you need
}

export interface TVShow {
    id: number;
    name: string;
    poster_path: string;
    backdrop_path: string;
    overview: string;
    first_air_date: string;
    vote_average: number;
    // Add other properties you need
}

// Function to get popular movies
export const getPopularMovies = async (page = 1): Promise<Movie[]> => {
    try {
        const response = await fetch(
            `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`
        );
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching popular movies:', error);
        return [];
    }
};

// Function to get movie details
export const getMovieDetails = async (id: string): Promise<Movie | null> => {
    try {
        const response = await fetch(
            `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`
        );

        if (!response.ok) {
            console.error(`Error fetching movie details: ${response.status} ${response.statusText}`);
            return null; // Return null for failed requests
        }

        const data = await response.json();

        // Check if API returns a "success: false" response
        if (data.success === false) {
            console.error(`Movie not found: ${data.status_message}`);
            return null;
        }

        return data;
    } catch (error) {
        console.error(`Error fetching details for movie ${id}:`, error);
        return null;
    }
};

// Function to get popular TV shows
export const getPopularTVShows = async (page = 1): Promise<TVShow[]> => {
    try {
        const response = await fetch(
            `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=en-US&page=${page}`
        );
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching popular TV shows:', error);
        return [];
    }
};

// Function to get TV show details
export const getTVShowDetails = async (id: string): Promise<TVShow | null> => {
    try {
        const response = await fetch(
            `${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=en-US`
        );

        if (!response.ok) {
            console.error(`Error fetching TV show details: ${response.status} ${response.statusText}`);
            return null;
        }

        const data = await response.json();

        if (data.success === false) {
            console.error(`TV show not found: ${data.status_message}`);
            return null;
        }

        return data;
    } catch (error) {
        console.error(`Error fetching details for TV show ${id}:`, error);
        return null;
    }
};
// Function to search for movies and TV shows
export const searchMediaContent = async (query: string, page = 1) => {
    try {
        const response = await fetch(
            `${BASE_URL}/search/multi?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
                query
            )}&page=${page}&include_adult=false`
        );
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error searching for content:', error);
        return [];
    }
};

export const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    params: {
        api_key: API_KEY,
    },
});

// Updated to include page parameter
export const getTrendingMovies = async (page = 1) => {
    const response = await api.get('/trending/movie/week', {
        params: {
            page: page
        }
    });
    return response.data;
};

export const getMovieGenres = async () => {
    const response = await api.get('/genre/movie/list');
    return response.data.genres; // Direct access to the genres array
};