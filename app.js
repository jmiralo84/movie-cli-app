// This is a Node.js Command Line Interface (CLI) application that interacts with The Movie Database (TMDB) API.
// The app allows users to search for movies by keyword, view detailed information about a selected movie, and store search history locally.

// Import necessary modules
import inquirer from 'inquirer';
import { searchMovies, getMovieDetails } from './api.js';
import { saveKeyword, getKeywordHistory } from './history.js';

// Function to prompt the user for the next action after displaying movie details
async function promptNextAction() {
    const { nextAction } = await inquirer.prompt([
        {
            type: 'list',
            name: 'nextAction',
            message: 'What would you like to do next? (search, history, exit)',
            choices: [
                { name: 'Search', value: 'search' },
                { name: 'History', value: 'history' },
                { name: 'Exit', value: 'exit' }
            ]
        }
    ]);

    // If the user wants to search again, prompt for a new keyword
    if (nextAction === 'search') {
        const { newKeyword } = await inquirer.prompt([
            {
                type: 'input',
                name: 'newKeyword',
                message: 'Enter a movie name to search for:'
            }
        ]);

        if (!newKeyword || !newKeyword.trim()) {
            console.log('No movie name entered.');
            return;
        }

        await runSearchFlow(newKeyword.trim());
        return;
    }

    // If the user wants to view keyword history, run the history flow
    if (nextAction === 'history') {
        await runHistoryFlow();
        return;
    }

    // Exit the application
    console.log('Goodbye.');
}

// Function to run the search flow, prompting the user for a keyword and displaying movie details
async function runSearchFlow(keyword) {
    try {
        // Save the search keyword to the history
        saveKeyword(keyword);

        // Search for movies using the provided keyword
        const movies = await searchMovies(keyword);

        // If no movies are found, inform the user and exit the function
        if (!movies || movies.length === 0) {
            console.log('No movies found for the given keyword.');
            return;
        }

        // Display a numbered list of search results
        console.log('\nSearch Results:');
        movies.forEach((movie, index) => {
            console.log(`${index + 1}. ${movie.title} (${movie.release_date || 'N/A'})`);
        });

        // Prompt the user to enter the number of the movie they want to view
        const { selectedNumber } = await inquirer.prompt([
            {
                type: 'input',
                name: 'selectedNumber',
                message: 'Enter the number of the movie to view details:',
                validate: (input) => {
                    const num = Number(input);
                    if (!Number.isInteger(num) || num < 1 || num > movies.length) {
                        return `Please enter a number between 1 and ${movies.length}.`;
                    }
                    return true;
                }
            }
        ]);

        // Retrieve the selected movie from the original search results
        const chosenMovie = movies[Number(selectedNumber) - 1];

        // If the selected movie is invalid, inform the user and exit the function
        if (!chosenMovie || !chosenMovie.id) {
            console.log('Could not determine the selected movie ID.');
            return;
        }

        // Retrieve detailed information about the selected movie using its unique ID
        const movieDetails = await getMovieDetails(chosenMovie.id);

        // If movie details cannot be retrieved, inform the user and exit the function
        if (!movieDetails) {
            console.log('Could not retrieve movie details.');
            return;
        }

        // Display the movie details to the user
        console.log('\nMovie Details');
        console.log(`ID: ${movieDetails.id}`);
        console.log(`Title: ${movieDetails.title}`);
        console.log(`Release Date: ${movieDetails.release_date || 'N/A'}`);
        console.log(`Overview: ${movieDetails.overview || 'N/A'}`);
        console.log(`Rating: ${movieDetails.vote_average || 'N/A'}`);

        // Prompt the user for the next action
        await promptNextAction();
    } catch (error) {
        console.log(`Error: ${error.message}`);
    }
}

// Function to run the history flow, prompting the user for a keyword
async function runHistoryFlow() {
    try {
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
            console.log('Goodbye.');
            return;
        }

        // Run the search flow with the selected keyword
        await runSearchFlow(selectedKeyword);
    } catch (error) {
        console.log(`Error: ${error.message}`);
    }
}

// Export the functions for use in other modules or for testing purposes
export { runSearchFlow, runHistoryFlow };