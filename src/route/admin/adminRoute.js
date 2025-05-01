const express = require("express");
const adminRoute = express.Router();

const adminAuthController = require("../../controller/api/admin/auth/auth.controller")


adminRoute.post("/login",adminAuthController.login);

module.exports = adminRoute;