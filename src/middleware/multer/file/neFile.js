const multer = require('multer');
const ensureDirectoryExistence = require('./makeDirectory');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const directory =  `/public/uploads/imageUpload/1`; 
        const root = '../../../../';
        const fullDirectoryPath = path.join(__dirname, root, directory);
        ensureDirectoryExistence(directory,root)
            .then(() => {
                cb(null, fullDirectoryPath); 
            })
            .catch((err) => {
                cb(err); 
            });
    },
    filename: function (req, file, cb) {
        const timestamp = Date.now(); // Current timestamp
        const randomNumber = Math.floor(Math.random() * 1000); // Random number between 0 and 999
        const extension = path.extname(file.originalname); // Extract file extension
        const uniqueFilename = `imageUpload-${timestamp}-${randomNumber}${extension}`;
        cb(null, file.fieldname + "-" + uuidv4() + path.extname (file.originalname));
    }
});

const newUpload = multer({
    storage: storage,
    // fileFilter: function (req, file, callback) {
    //     if (!file) {
    //         return callback(new Error("Please upload the file"));
    //     } else {
    //         const ext = path.extname(file.originalname);
    //         if (ext === ".png" || ext === ".jpeg" || ext === ".jpg") {
    //             callback(null, true);
    //         } else {
    //             return callback(new Error("Only JPG, PNG, JPEG files are supported."));
    //         }
    //     }
    // }
});

module.exports = { newUpload };