/*
The CLI is the main entry point for the application. This file handles all user interaction and
connects with app.js to perform the main fucntions of the app.

node cli.js --help -> Displays all available commands/parameters
node cli.js search -> Providing a specific keyword returns a specific movie result or a list of related results
node cli.js history keywords -> Provides a list of all searched keywords, and prompts the user to select one to view the related movie results or exit
*/

// Imports
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { runSearchFlow, runHistoryFlow } from './app.js';

// Printer Function for help commands
function printHelp() {
    console.log('Usage: node cli.js <command> [options]');
    console.log('Commands:');
    console.log('  search <keyword>   Search for movies by <keyword>');
    console.log('  history <keywords> Display list of all searched keywords, and allows selection of a previously searched keyword');
    console.log('  --help             Display this help message');
}

// Configure yargs to handle command line arguments and commands
yargs(hideBin(process.argv))
    .usage('Usage: $0 <command> [options]')
    /*
    .command( // help command
        '--help',
        'Displays all available commands/parameters',
        () => {}, // no arguments
        () => { printHelp(); } // handler
    )
        */
    .command( // history command
        'history keywords',
        'Display search history and asks user to select a searched keyword to view related movie results or exit',
        () => {}, // no arguments
        () => { runHistoryFlow(); } // handler
    )
    .command( // search command
        'search <keyword>',
        'Search for movies by <keyword>',
        (yargs) => {
            yargs
                .positional('keyword', {
                    describe: 'Keyword to search for movies',
                    type: 'string'
                });
        },
        (argv) => { runSearchFlow(argv.keyword); } // handler
    )
    .help()
    .parse();