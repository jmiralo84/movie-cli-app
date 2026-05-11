// Author: Lester Low

// Import .env and express
import 'dotenv/config'; 
import express from 'express';

// Import routes and database services
import mongo from './services/db.js';
import history from "./routes/history.js";
import movies from "./routes/movies.js";

// Define port num and express instance
const PORT = 8888;
const app = express();

app.use(express.json());

// Define root route
app.get("/", (req, res) => {
    res.send("Welcome to the Movie Search API");
});

app.use('/history', history); // Setup history path/route under /history
app.use('/movies', movies); // Setup movies path/route under /movies

// Start the server
app.listen(PORT, async () => {
    try {
        // Check for and validate environment variables before connecting to the databse
        const requiredEnv = ['DB_USER', 'DB_PASSWORD', 'DB_HOST', 'DB_NAME'];
        const missingEnv = requiredEnv.filter((key) => !process.env[key]); 
        if (missingEnv.length) { // If any are missing, send error msg and stop connection
            throw new Error(`Missing required .env values: ${missingEnv.join(', ')}`);
        }

        await mongo.connect();
        console.log(`Server is listening on port ${PORT}`);
        
    } catch (error) { // Any unexpected errors handled here
        console.error('Server failed to start', error);
        process.exit(1);
    }
});
