const express = require("express");
const { roomCallController } = require("../../controllers");
const { vertifyToken } = require("../../middlewares/vertifyToken");

const roomCallRouter = express.Router();

roomCallRouter.get("/:roomChatId", roomCallController.getRoomChat);

roomCallRouter.post("/", roomCallController.createRoomCall);

roomCallRouter.put("/", roomCallController.addMember);

roomCallRouter.delete("/:roomCallId", roomCallController.deleteRoomCall);

module.exports = roomCallRouter;
