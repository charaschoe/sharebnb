const fs = require('fs');
const path = require('path');

const directoryPath = '/Users/admin/sharebnb/js/';
let totalAirbnbs = 0;

// Function to read JSON files and count Airbnbs
const countAirbnbs = (filePath) => {
    const data = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(data);
    return jsonData.length; // Assuming each JSON file contains an array of Airbnbs
};

// Read all files in the directory
fs.readdir(directoryPath, (err, files) => {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }

    files.forEach((file) => {
        if (path.extname(file) === '.json') {
            const filePath = path.join(directoryPath, file);
            totalAirbnbs += countAirbnbs(filePath);
        }
    });

    console.log('Total number of Airbnbs:', totalAirbnbs);
});