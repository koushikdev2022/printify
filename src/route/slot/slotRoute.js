const express = require("express")
const slotRoute = express.Router();
const buySlotValidation = require("../../validations/user/slot/addUserSlot")
const slotController = require("../../controller/api/user/slot/slot.controller");

slotRoute.get('/list',slotController.list)
slotRoute.post('/add-user-slot',buySlotValidation,slotController.buySlot)
slotRoute.get('/user-slot',slotController.userSlot)
slotRoute.get('/total-character',slotController.character)
slotRoute.get('/total-group',slotController.group)

module.exports = slotRoute;