const multer = require('multer');
const ensureDirectoryExistence = require("../directory/makeDirectory");
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const user_id = req?.user?.id;
        const directory = `/public/uploads/character_details/`; 
        const root = '../../../';
        const fullDirectoryPath = path.join(__dirname, root, directory);

        ensureDirectoryExistence(directory, root)
            .then(() => {
                cb(null, fullDirectoryPath); 
            })
            .catch((err) => {
                cb(err); 
            });
    },
    filename: function (req, file, cb) {
        const timestamp = Date.now(); 
        const randomNumber = Math.floor(Math.random() * 1000); 
        const extension = path.extname(file.originalname); 
        const uniqueFilename = `character-${timestamp}-${randomNumber}${extension}`;
        cb(null, uniqueFilename); 
    }
});

const characterDetailUpload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        const ext = path.extname(file.originalname);
        if (ext === ".jpg" || ext === ".jpeg" || ext === ".png") {
            callback(null, true);
        } else {
            return callback(new HttpException(400, "Only jpg, jpeg, png files are supported."));
        }
    }
});

module.exports = { characterDetailUpload };