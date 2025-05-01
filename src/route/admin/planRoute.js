const express = require("express");
const planRoute = express.Router();

const planController = require("../../controller/api/admin/plan/plan.controller")
const planValidation = require("../../validations/admin/plan/createPlanValidation")
const updatePlanValidation = require("../../validations/admin/plan/updatePlanValidation")
const createPlanSlot = require("../../validations/admin/plan/createSlotPlan")

planRoute.post('/create',planValidation,planController.create);
planRoute.post('/update',updatePlanValidation,planController.update);
planRoute.post('/list',planController.list);
planRoute.post('/status',planController.status);
planRoute.post('/slot-list',planController.slot);
planRoute.post('/slot-create',createPlanSlot,planController.slotCreate);
planRoute.post('/slot-status',planController.slotStatus);


module.exports = planRoute;