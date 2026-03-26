import axios from 'axios';

const BASE = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;

if (!API_KEY) {
    throw new Error('Missing TMDB_API_KEY environment variable');
}

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

export const searchMovies = async (query) => {
    const data = await get('/search/movie', { query });
    return data.results || [];
};

export const getMovieDetails = async (movieId) => {
    return await get(`/movie/${movieId}`);
};