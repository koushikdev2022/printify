const fs = require('fs');
const path = require('path');


function ensureDirectoryExistence(directory,root) {
    console.log(directory);
    const dir = path.join(__dirname,root, directory); 
    console.log(dir);
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(dir)) {
            fs.mkdir(dir, { recursive: true, mode: 0o777 }, (err) => {
                if (err) {
                    reject(err); 
                } else {
                    resolve(); 
                }
            });
        } else {
            resolve(); 
        }
    });
}

module.exports = ensureDirectoryExistence;



