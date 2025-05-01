const express = require("express")

const planRoute = express.Router()

const planController = require("../../controller/api/user/plan/plan.controller")

planRoute.post('/',planController.list) 

module.exports = planRoute