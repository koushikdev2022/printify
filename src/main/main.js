const express = require("express");

const http = require("http"); 

const cors = require("cors");
const path = require("path");

const load = require("../route/load")
const app = express();

require("dotenv").config();

const port = process.env.PORT


app.use(cors({
    origin: "*",  
    methods: ["GET", "POST"]
}));
app.use(express.urlencoded({ limit: "400mb", extended: false }));
app.use(express.json({ limit: "400mb" }));

app.use(load);


module.exports = {app,port}