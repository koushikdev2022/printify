const express = require("express");
const printifyRoute = express.Router();

const printifyController = require("../../controller/api/printify/printify.controller");

printifyRoute.get("/store",printifyController.store);
printifyRoute.post("/store-save",printifyController.saveProduct);

module.exports = printifyRoute