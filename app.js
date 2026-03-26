// This is a Node.js Command Line Interface (CLI) application that interacts with The Movie Database (TMDB) API.
// The app allows users to search for movies by keyword, view detailed information about a selected movie, and store search history locally.

// Import necessary modules
const inquirer = require('inquirer');
const { searchMovies, getMovieDetails } = require('./api');
const { saveKeyword, getKeywordHistory } = require('./history');

// Function to run the search flow, prompting the user for a keyword and displaying movie details
async function runSearchFlow(keyword) {
    // Save the search keyword to the history
    saveKeyword(keyword);

    // Search for movies using the provided keyword
    const movies = await searchMovies(keyword);
    
    // If no movies are found, inform the user and exit the function
    if (!movies || movies.length === 0) {
        console.log('No movies found for the given keyword.');
        return;
    }

    // Prompt the user to select a movie from the search results
    const { selectedMovie } = await inquirer.prompt([
        {
            type: 'list',
            name: 'selectedMovie',
            message: 'Select a movie to view details:',
            choices: movies.map(movie => ({
                name: `${movie.title} (${movie.release_date || 'N/A'})`,
                value: movie.id
            }))
        }
    ]);

    // Retrieve detailed information about the selected movie
    const movieDetails = await getMovieDetails(selectedMovie);

    // If movie details cannot be retrieved, inform the user and exit the function
    if (!movieDetails) {
        console.log('Could not retrieve movie details.');
        return;
    }

    // Display the movie details to the user
    console.log('Movie Details:');
    console.log(`Title: ${movieDetails.title}`);
    console.log(`Release Date: ${movieDetails.release_date}`);
    console.log(`Overview: ${movieDetails.overview}`);
    console.log(`Rating: ${movieDetails.vote_average}`);
}

// Function to run the search flow, prompting the user for a keyword
async function runHistoryFlow() {
    // Retrieve search history and prompt the user to select a keyword
    const keywords = getKeywordHistory();

    // If there are no keywords in the history, inform the user and exit
    if (!keywords || keywords.length === 0) {
        console.log('No search history found.');
        return;
    }

    // Prompt the user to select a keyword from the history
    const { selectedKeyword } = await inquirer.prompt([
        {
            type: 'list',
            name: 'selectedKeyword',
            message: 'Select a keyword to view search results:',
            choices: ['Exit', ...keywords]
        }
    ]);

    // Add an option to exit the application
    if (selectedKeyword === 'Exit') {
        return;
    }

    // Run the search flow with the selected keyword
    await runSearchFlow(selectedKeyword);
}

// Export the functions for use in other modules or for testing purposes
module.exports = {
    runSearchFlow,
    runHistoryFlow
};

/* For testing purposes
if(require.main === module) {
    main();
}
*/