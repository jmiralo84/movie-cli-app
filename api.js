import axios from 'axios';

// Base URL and API key for TMDB API
const BASE = 'https://api.themoviedb.org/3';
const API_KEY = '5b7cf973d3c43a7e560f50041aaba61b';

// Ensure the API key is set before making any requests
if (!API_KEY) {
    throw new Error('Missing TMDB_API_KEY environment variable');
}

// Helper function to make GET requests to the TMDB API with error handling
const get = async (path, params = {}) => {
    try {
        const response = await axios.get(`${BASE}${path}`, {
            params: {
                api_key: API_KEY,
                ...params
            }
        });

        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(
                `TMDB error ${error.response.status}: ${JSON.stringify(error.response.data)}`
            );
        }
        throw error;
    }
};

// Function to search for movies by keyword, returning an array of movie results
export const searchMovies = async (query) => {
    const data = await get('/search/movie', { query });
    return data.results || [];
};

// Function to get detailed information about a movie by its ID
export const getMovieDetails = async (movieId) => {
    if (!movieId) {
        throw new Error('A valid movie ID is required');
    }

    return await get(`/movie/${movieId}`);
};