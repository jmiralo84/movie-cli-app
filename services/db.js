// Author: Joe Miranda

// Import necessary modules
import {MongoClient} from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create MongoDB connection string using env variables
const uri = 'mongodb+srv://$'
