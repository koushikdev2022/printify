const express = require("express")
const paymantRoute = express.Router()

const planController = require("../../controller/api/user/plan/plan.controller")

paymantRoute.get("/",planController.list)

module.exports = paymantRoute;
