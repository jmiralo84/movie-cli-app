const fs = require('fs');
const path = require('path');

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

module.exports = {
    saveKeyword,
    getKeywordHistory
};

