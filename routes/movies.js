// Author: Benjamin Saucedo
// This file handles the /movies endpoints

import express from 'express';

import { searchMovies, getMovieDetails } from '../services/api.js';
import db from '../services/db.js';

const router = express.Router();

// helper function to format TMDB search results into the required shape
// each item must contain only two keys: display and identifier
const _formatMovies = (movies) => {
    return movies.map((movie) => {
        //if year exists, pull just the year out of the release date (e.g. "2010-07-16" -> "2010")
        const year = movie.release_date ? movie.release_date.slice(0, 4) : 'N/A';

        return {
            display: `${movie.title} (${year})`,
            identifier: movie.id
        };
    });
};

// GET /movies?keyword=<keyword>
router.get('/', async (req, res) => {
    try {
        const { keyword } = req.query;

        // validate the keyword query param is present and non-empty
        if (!keyword || !keyword.trim()) {
            return res
                .status(400)
                .json({ error: 'Query parameter "keyword" is required.' });
        }

        //trim whitespace
        const trimmedKeyword = keyword.trim();

        // call the TMDB search API through services/api.js
        const movies = await searchMovies(trimmedKeyword);

        // reshape results into clean { display, identifier } objects
        const formatted = _formatMovies(movies);

        // return the cleaned JSON response to the client
        res.json(formatted);

        // save the unique search keyword to the SearchHistoryKeyword collection
        // first check if the keyword already exists -> only insert if it does not
        const cursor = await db.find('SearchHistoryKeyword', {
            keyword: trimmedKeyword
        });
        const existing = await cursor.next();

        //only insert keyword if not saved before
        if (!existing) {
            await db.insert('SearchHistoryKeyword', { keyword: trimmedKeyword });
        }
    } catch (error) {
        // handle unexpected errors (network, TMDB error, db error)
        res.status(500).json({ error: error.message });
    }
});

// GET /movies/:id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // call the TMDB movie-by-id API through services/api.js
        const details = await getMovieDetails(id);

        // return the detailed data as JSON
        res.json(details);
    } catch (error) {
        // handle unexpected errors
        res.status(500).json({ error: error.message });
    }
});

export default router;