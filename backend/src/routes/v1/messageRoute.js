const express = require("express");
const { messageController } = require("../../controllers");
const { vertifyToken } = require("../../middlewares/vertifyToken");

const messageRouter = express.Router();

messageRouter.post("/", messageController.createMessage);

messageRouter.get(
  "/:conversationId",
  vertifyToken,
  messageController.getMessages
);

messageRouter.get(
  "/get-number-message-not-read",
  vertifyToken,
  messageController.getMessagesNotRead
);

messageRouter.post(
  "/update-read-message",
  vertifyToken,
  messageController.updateReadMessage
);

messageRouter.delete(
  "/:messageId",
  vertifyToken,
  messageController.deleteMessage
);

module.exports = messageRouter;
