const fs = require('fs');
const path = require('path');

// Global function to create directories recursively
function ensureDirectoryExistence(directory,root) {
    console.log(directory);
    const dir = path.join(__dirname,root, directory); // Absolute path
    console.log(dir);
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(dir)) {
            fs.mkdir(dir, { recursive: true, mode: 0o777 }, (err) => {
                if (err) {
                    reject(err); // Reject if error occurs
                } else {
                    resolve(); // Resolve after successful creation
                }
            });
        } else {
            resolve(); // Directory already exists
        }
    });
}

module.exports = ensureDirectoryExistence;