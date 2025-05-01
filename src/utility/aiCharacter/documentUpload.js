const multer = require('multer');
const ensureDirectoryExistence = require("../../utility/directory/makeDirectory");
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const user_id = req?.user?.id;
        const directory = `/public/uploads/character_documents/${user_id}`; 
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
        const uniqueFilename = `document-${req.user?.id}-${timestamp}-${randomNumber}${extension}`;
        cb(null, uniqueFilename); 
    }
});

const characterDocumentUpload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        const ext = path.extname(file.originalname);
        if (ext === ".doc" || ext === ".docx" || ext === ".pdf") {
            callback(null, true);
        } else {
            return callback(new HttpException(400, "Only doc, docx, pdf files are supported."));
        }
    }
});

module.exports = { characterDocumentUpload };