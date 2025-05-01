const express = require("express")
const addressRoute = express.Router()

const addressController = require("../../controller/api/user/address/address.controller")
const addAddressValidation = require("../../validations/user/address/addAdressValidation") 

addressRoute.post("/create",addAddressValidation,addressController.create)
addressRoute.get("/list",addressController.list)
addressRoute.get("/list",addressController.changePrimary)

module.exports = addressRoute;