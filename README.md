# **Movie CLI App (TMDB)**
## Description

This is a Node.js Command Line Interface (CLI) application that interacts with The Movie Database (TMDB) API.
The app allows users to search for movies by keyword, view detailed information about a selected movie, and store search history locally.

## Features
Search movies by keyword
Select a movie from a user-friendly list
View detailed movie information
Store unique search keywords in a local JSON file
View and reuse past search keywords

## Technologies Used
Node.js
Axios
TMDB API
JavaScript (ES6)

## Project Structure
project-root/
│
├── cli.js                # Handles CLI commands and user input
├── app.js                # Core application logic
├── api.js                # Handles API requests (TMDB)
├── history.js            # Manages search history
├── search_history_keyword.json  # Stores past keywords
├── package.json
├── package-lock.json
└── README.md

## Environment Setup
This project uses the TMDB API, which requires an API key.

Create an account at https://www.themoviedb.org/
Generate an API key
Store your API key in your project (example):
const API_KEY = "your_api_key_here";


## Usage
### Help Menu
node cli.js --help

### Search for a Movie
node cli.js search <keyword>

### Example:
node cli.js search batman

## View Search History
node cli.js history keywords

## How It Works
1. The user enters a command in the CLI
2. cli.js parses the command and passes it to app.js
3. app.js calls api.js to fetch data from TMDB
4. Results are displayed in a user-friendly format
5. Keywords are stored using history.js

## Team Members
Joe Miranda
Edgard Zaragoza
Lester Low
Benjamin Saucedo
