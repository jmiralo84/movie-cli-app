// Author: Edgard Zaragoza
// This file handles the /history endpoint

import express from 'express';
import mongo from '../services/db.js';

const router = express.Router();

// When someone calls GET /history?type=keywords
router.get('/', async (req, res) => {
    // Get the "type" value from the URL
    const { type } = req.query;

    // If no type was given, send back an error
    if (!type) {
        return res.status(400).json({ error: 'Query parameter "type" is required.' });
    }

    // If type is not "keywords", send back an error
    if (type !== 'keywords') {
        return res.status(400).json({ error: 'Invalid type. Only "keywords" is supported.' });
    }

    try {
        // Connect to the database
        const cursor = await mongo.find('SearchHistoryKeyword');

        // Get all saved keywords, hide the _id field
        const keywords = await cursor
            .project({ _id: 0, keyword: 1 })
            .toArray();

        // Send the keywords back as JSON
        res.json(keywords);
    } catch (error) {
        // Something went wrong with the database
        res.status(500).json({ error: 'Failed to retrieve keyword history.' });
    }
});

export default router;