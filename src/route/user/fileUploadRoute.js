const express = require("express");
const fileUploadRoute = express.Router()

const videoController = require("../../controller/api/user/video/video.controller")

fileUploadRoute.post('/upload',videoController.upload)

module.exports = fileUploadRoute;