/*
The CLI is the main entry point for the application. This file handles all user interaction and
connects with app.js to perform the main fucntions of the app.

node cli.js --help -> Displays all available commands/parameters 
node cli.js search -> Providing a specific keyword returns a specific movie result or a list of related results, prompting the user to select one to view.
ser to select onnode cli.js history keywords -> Provides a list of all searched keywords.
*/

// Imports
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { runSearchFlow, runHistoryFlow } from './app.js';

// Configure yargs to handle command line arguments and commands
yargs(hideBin(process.argv))
    .usage('Usage: $0 <command> [options]')
    .command( // history command
        'history keywords',
        'Display search history from previous searches.',
        () => {}, // no arguments
        () => { runHistoryFlow(); } // handler
    )
    .command( // search command
        'search <keywords...>',
        'Search for movies by <keywords>',
        (yargs) => {
            yargs
                .positional('keywords', {
                    describe: 'Keyword to search for movies',
                    type: 'string',
                    array: true,
                });
        },
        (argv) => { // handler
            // Concatenates keywords if there are multiple
            const joinedKeywords = argv.keywords.join(' ');
            runSearchFlow(joinedKeywords); 
        } 
    )
    .help()
    .parse();