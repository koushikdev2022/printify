const express = require("express");
const characterRoute = express.Router();
const {characterDetailUpload} = require("../../utility/characterDetail/characterDetailUpload");
const characterController = require("../../controller/api/admin/character/character.controller");

characterRoute.post('/create-character',characterDetailUpload.single('character_image'),characterController.createCharacter);
characterRoute.post('/list',characterController.list);
characterRoute.post('/publish-character',characterController.publishCharacter);
characterRoute.post('/publish-character-detail',characterController.publishCharacterDetail);
module.exports = characterRoute;