import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory of the module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FILE = path.join(__dirname, 'search_history.json');

function getKeywordHistory() {
    try {
        if (!fs.existsSync(FILE)) {
            fs.writeFileSync(FILE, JSON.stringify([], null, 2));
            return [];
        }

        const data = fs.readFileSync(FILE, 'utf8');
        return JSON.parse(data || '[]');
    } catch (error) {
        console.log('Error reading history:', error.message);
        return [];
    }
}

function saveKeyword(keyword) {
    try {
        const cleanKeyword = keyword.trim().toLowerCase();
        if (!cleanKeyword) return;

        const history = getKeywordHistory();

        if (!history.includes(cleanKeyword)) {
            history.push(cleanKeyword);
            fs.writeFileSync(FILE, JSON.stringify(history, null, 2));
        }
    } catch (error) {
        console.log('Error saving keyword:', error.message);
    }
}

export { saveKeyword, getKeywordHistory };
