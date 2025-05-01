const express = require("express");
const aiCharacterRoute = express.Router();
const aiCharacterController = require("../../controller/api/user/aiCharacter/aiCharacter.controller");
const isUserAuthenticateMiddleware = require("../../middleware/user/isUserAuthenticateMiddleware");
const step1Validation = require("../../validations/user/aiCharacter/step1Validation");
const step2Validation = require("../../validations/user/aiCharacter/step2Validation");
const step3Validation = require("../../validations/user/aiCharacter/step3Validation");
const step4Validation = require("../../validations/user/aiCharacter/step4Validation");
const {characterDocumentUpload} = require("../../utility/aiCharacter/documentUpload");
aiCharacterRoute.post('/create-character-step1',isUserAuthenticateMiddleware,step1Validation,aiCharacterController.createCharacterStep1);
aiCharacterRoute.post('/create-character-step2',isUserAuthenticateMiddleware,step2Validation,aiCharacterController.createCharacterStep2);
aiCharacterRoute.post('/create-character-step3',isUserAuthenticateMiddleware,step3Validation,aiCharacterController.createCharacterStep3);
aiCharacterRoute.post('/create-character-step4',isUserAuthenticateMiddleware,step4Validation,aiCharacterController.createCharacterStep4);
aiCharacterRoute.post('/list',isUserAuthenticateMiddleware,aiCharacterController.list);
module.exports = aiCharacterRoute