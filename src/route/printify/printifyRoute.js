const express = require("express");
const printifyRoute = express.Router();

const printifyController = require("../../controller/api/printify/printify.controller");

printifyRoute.get("/store",printifyController.store);
printifyRoute.post("/store-save",printifyController.saveProduct);
printifyRoute.get("/store-category",printifyController.category);
printifyRoute.post("/store-save-new",printifyController.saveProductSave);
printifyRoute.get("/store-varient/:id/:pid",printifyController.varient);
printifyRoute.get("/store-provider/:id",printifyController.provider);

module.exports = printifyRoute