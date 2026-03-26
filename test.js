import { searchMovies, getMovieDetails } from './api.js';

const run = async () => {
    try {
        const results = await searchMovies('Inception');

        console.log('Search results:');
        console.log(results[0]);

        const id = results[0].id;

        const details = await getMovieDetails(id);

        console.log('\nMovie details:');
        console.log(details);
    } catch (err) {
        console.error(err);
    }
};

run();