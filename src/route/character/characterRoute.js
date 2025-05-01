const express = require("express");
const characterRoute = express.Router();


const {fileUpload} = require("../../middleware/multer/file/fileUpload")
const {groupfileUpload} = require("../../middleware/multer/file/groupFileUpload")
const dataValidation = require("../../validations/user/character/dataValidation")
const deleteValidation = require("../../validations/user/character/deleteValidation")
const firstStep = require("../../validations/user/character/firstStepValidation")
const storyValidation = require("../../validations/user/character/storyValidation")
const avatarLinkValidation = require("../../validations/user/character/avtarLinkValidation")
const avatarImageValidation = require("../../validations/user/character/avatarImageValidation")
const characterController = require("../../controller/api/user/character/character.controller")
const isUserAuthenticateMiddleware = require("../../middleware/user/isUserAuthenticateMiddleware");
const firstStepEdit = require("../../validations/user/character/firstStepEditValidation")
const chatValidation = require("../../validations/user/character/chatValidation") 
const voiceValidation = require("../../validations/user/character/voiceValidation")
const preferedVoiceValidation = require("../../validations/user/character/preferedVoiceValidation");
const createGroupValidation = require("../../validations/user/group/groupValidation");

characterRoute.post('/add',isUserAuthenticateMiddleware,firstStep,characterController.add);
characterRoute.post('/second-add-image',isUserAuthenticateMiddleware,avatarLinkValidation,characterController.secondAdd);
characterRoute.post('/second-add-avatar',isUserAuthenticateMiddleware,fileUpload.single('image'),avatarImageValidation,characterController.image);
characterRoute.post('/second-add-story',isUserAuthenticateMiddleware,storyValidation,characterController.story);
characterRoute.post('/list',isUserAuthenticateMiddleware,characterController.list);
characterRoute.post('/delete',isUserAuthenticateMiddleware,deleteValidation,characterController.delete);
characterRoute.post('/copy',isUserAuthenticateMiddleware,dataValidation,characterController.data);
characterRoute.post('/copy-list',isUserAuthenticateMiddleware,dataValidation,characterController.dataList);
characterRoute.post('/image',isUserAuthenticateMiddleware,characterController.imagedata);
characterRoute.post('/edit-list',isUserAuthenticateMiddleware,characterController.editList);
characterRoute.post('/edit-first',isUserAuthenticateMiddleware,firstStepEdit,characterController.editFirst);
characterRoute.get('/total-character/subscription',isUserAuthenticateMiddleware,characterController.totalCharacter);
characterRoute.post('/second-add-avatar-create',isUserAuthenticateMiddleware,fileUpload.single('image'),characterController.imagecreate);
characterRoute.post('/second-add-image-create',isUserAuthenticateMiddleware,characterController.secondAddcreate);
characterRoute.post('/chat-list',isUserAuthenticateMiddleware,chatValidation,characterController.chatList)
characterRoute.post('/voice',isUserAuthenticateMiddleware,voiceValidation,characterController.voice)
characterRoute.get('/last-chat',isUserAuthenticateMiddleware,characterController.lastChat)
characterRoute.post('/prefered-voice',isUserAuthenticateMiddleware,preferedVoiceValidation,characterController.preferedVoice)
characterRoute.get('/list-tag',isUserAuthenticateMiddleware,characterController.tags)
characterRoute.post('/map-tag',isUserAuthenticateMiddleware,characterController.map)
characterRoute.post('/public',isUserAuthenticateMiddleware,characterController.public)
characterRoute.post('/list-explore',isUserAuthenticateMiddleware,characterController.explore)
characterRoute.post('/create-g',isUserAuthenticateMiddleware,createGroupValidation,characterController.groupCreate)
characterRoute.post('/create-group-maps',isUserAuthenticateMiddleware,characterController.groupMap)
characterRoute.post('/remove-from-group',isUserAuthenticateMiddleware,characterController.remove)
characterRoute.post('/group-list',isUserAuthenticateMiddleware,characterController.groupList)
characterRoute.post('/group-characters',isUserAuthenticateMiddleware,characterController.groupCharacter)
characterRoute.get('/search-character',isUserAuthenticateMiddleware,characterController.search)
characterRoute.post('/group-chat',isUserAuthenticateMiddleware,characterController.group)
characterRoute.post('/character-delete',isUserAuthenticateMiddleware,characterController.characterDelete)
characterRoute.post('/group-delete',isUserAuthenticateMiddleware,characterController.groupDelete)
characterRoute.post('/group-image',isUserAuthenticateMiddleware,groupfileUpload.single('img'),characterController.groupImage)

module.exports = characterRoute