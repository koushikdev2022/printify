const express = require("express");
const forgetPasswordRoute = express.Router();

const forgetPasswordController = require("../../controller/api/user/forgetPassword/forgetPassword.controller");
const forgetPasswordValidation = require("../../validations/user/forgetPassword/forgetPasswordValidation");
const resetPasswordValidation = require("../../validations/user/forgetPassword/resetPasswordValidation");


forgetPasswordRoute.post('/send-mail',forgetPasswordValidation,forgetPasswordController.sendMail);
forgetPasswordRoute.post('/reset-password',resetPasswordValidation,forgetPasswordController.resetPassword);

module.exports=forgetPasswordRoute;