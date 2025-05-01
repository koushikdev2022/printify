const express = require("express")
const profileRoute = express.Router();

const profileController = require("../../controller/api/user/profile/profile.controller")
const {fileUpload} = require("../../middleware/multer/file/fileUpload")

profileRoute.post("/update",profileController.update)
profileRoute.get("/my-profile",profileController.profile)
profileRoute.post("/avatar",fileUpload.single("avatar"),profileController.avatar)

module.exports = profileRoute