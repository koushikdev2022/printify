const express = require("express");
const resetPasswordRoute = express.Router();

const resetPasswordController = require("../../controller/api/admin/resetPassword/resetpassword.controller")
const resetPasswordValidation = require("../../validations/user/resetPassword/resetPasswordValidation")


resetPasswordRoute.post("/",resetPasswordValidation,resetPasswordController.reset)

module.exports = resetPasswordRoute;