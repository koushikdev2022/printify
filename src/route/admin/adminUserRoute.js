const express = require("express");
const adminUserRoute = express.Router();

const userController = require("../../controller/api/admin/user/user.controller")
const userStatusValidation = require("../../validations/admin/userStatusValidation")
const walletFreezeValidation = require("../../validations/admin/walletFreezeValidation")
const transactionCredit = require("../../validations/admin/transactionCreditValidation")


adminUserRoute.post("/list",userController.list);
adminUserRoute.post("/status",userStatusValidation,userController.status);
adminUserRoute.post("/transaction",userStatusValidation,userController.transaction);
adminUserRoute.post("/wallet",userStatusValidation,userController.wallet);
adminUserRoute.post("/wallet-freeze",walletFreezeValidation,userController.walletFreeze);
adminUserRoute.post("/give-credit",transactionCredit,userController.credit);
adminUserRoute.post("/video-status",userController.videoStatus);
adminUserRoute.post("/video-feature",userController.videoFeature);
adminUserRoute.post("/character-public",userController.public);
adminUserRoute.get("/user-video-list/:entity/:limit/:page/:user_id",userController.userVideo);



module.exports = adminUserRoute;