const express = require("express");
const { authController } = require("../../controllers");
const { vertifyToken } = require("../../middlewares/vertifyToken");

const authRouter = express.Router();

authRouter.post("/register", authController.register);

authRouter.post("/login", authController.login);

authRouter.delete("/logout", vertifyToken, authController.logout);

authRouter.get("/refresh-token", authController.handleRefreshToken);

module.exports = authRouter;
