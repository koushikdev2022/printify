const express = require("express");
const tokenRoute = express.Router();

const tokenController = require("../../controller/api/user/auth/token.controller") 

tokenRoute.get('/verify-token',tokenController.verifyUserToken);


module.exports = tokenRoute