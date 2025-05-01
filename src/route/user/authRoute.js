const express = require("express");
const authRoute = express.Router();
const userRegistrationValidation = require("../../validations/user/auth/userRegisterValidation");
const userLoginValidation = require("../../validations/user/auth/userLoginValidation");
const isUserAuthenticateMiddleware = require("../../middleware/user/isUserAuthenticateMiddleware");
const authController = require("../../controller/api/user/auth/auth.controller")
const userDetails = require("../../validations/user/auth/updateDetails")
const resendOtpValidation = require("../../validations/user/auth/resendOtpValidation")

authRoute.post("/register",userRegistrationValidation,authController.register);
authRoute.post("/resend-otp",resendOtpValidation,authController.resendOtp);
authRoute.post("/verify-otp",authController.veryfyOtp);
authRoute.post('/login',userLoginValidation,authController.login)
authRoute.post('/get-new-token',isUserAuthenticateMiddleware,authController.getNewToken);
authRoute.post('/update-details',isUserAuthenticateMiddleware,userDetails,authController.updateDetails)
authRoute.get('/details',isUserAuthenticateMiddleware,authController.details)
authRoute.post('/google',authController.googlelogin)

module.exports = authRoute