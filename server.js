// TEMPORARY local stub for testing the /movies endpoints.
// The Server Developer's official server.js will replace this.

import express from 'express';

import movies from './routes/movies.js';
// import history from './routes/history.js'; // disabled until history.js is updated for the new db.js
import db from './services/db.js';

const PORT = 8888;

// create express application instance
const app = express();

// parse JSON body from put and post requests
app.use(express.json());

// GET route to handle request to the root URL (localhost:8888)
app.get('/', (req, res) => {
    res.send('Welcome to the Movies App');
});

// mount routers
app.use('/movies', movies);
// app.use('/history', history); // disabled until history.js is updated

// start the server on the port specified
app.listen(PORT, async () => {
    try {
        await db.connect();
        console.log(`Server is listening on port ${PORT}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
});