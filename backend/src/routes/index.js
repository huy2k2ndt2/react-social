const express = require("express");

const routes = express.Router();

routes.use("/v1/api", require("./v1"));

module.exports = routes;
