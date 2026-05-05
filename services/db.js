// Author: Joe Miranda

// Import necessary modules
import {MongoClient} from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create MongoDB connection string using env variables
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri);

// Store database connection
let db;

// Funch to connect to MongoDB Atlas
async function connectToDB() {
    try {
        // If the database connection already exists, return it
        if (db) {
            return db;
        }

        // Connect to MongoDB Atlas
        await client.connect();        

        // Select the database
        db = client.db(process.env.DB_NAME);
        console.log('Connected to MongoDB Atlas');

        return db;
    }
    catch (error) {
        console.log('Error connecting to MongoDB Atlas:', error.message);
        throw error;
    }
}

// Function to get database connection
async function getDB() {
    if (!db) {
        throw new Error('Database connection not established. Call connectToDB() first.');        
    }
    return db;
}

// Export the functions
export {connectToDB, getDB};