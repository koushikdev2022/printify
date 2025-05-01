const express = require("express");
const videoRoute = express.Router();

const videoController = require("../../controller/api/user/video/video.controller")

module.exports = videoRoute