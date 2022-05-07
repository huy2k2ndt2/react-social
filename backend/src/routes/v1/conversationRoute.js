const express = require("express");
const { conversationController } = require("../../controllers");
const { vertifyToken } = require("../../middlewares/vertifyToken");

const conversationRouter = express.Router();

conversationRouter.post(
  "/update-conversation",
  conversationController.updateConversation
);
conversationRouter.post(
  "/",
  vertifyToken,
  conversationController.createConversation
);
conversationRouter.put("/", conversationController.updateRoomCallId);

conversationRouter.get(
  "/get-status-conversation",
  vertifyToken,
  conversationController.getConversationUnwatch
);
conversationRouter.get(
  "/get-all-conversations",
  vertifyToken,
  conversationController.getConversations
);
conversationRouter.get(
  "/",
  vertifyToken,
  conversationController.getConversation
);

module.exports = conversationRouter;
