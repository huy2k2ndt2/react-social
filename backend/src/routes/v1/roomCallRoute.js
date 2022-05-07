const express = require("express");
const { roomCallController } = require("../../controllers");
const { vertifyToken } = require("../../middlewares/vertifyToken");

const roomCallRouter = express.Router();

roomCallRouter.get("/", roomCallController.getRoomChat);

roomCallRouter.post("/", roomCallController.createRoomCall);

roomCallRouter.put("/", roomCallController.addMember);

roomCallRouter.delete("/", roomCallController.deleteRoomCall);

module.exports = roomCallRouter;
