const authController = require("./authController");
const commentController = require("./commentController");
const conversationController = require("./conversationController");
const friendRequestController = require("./friendRequestController");
const imageController = require("./imageController");
const messageController = require("./messageController");
const notificationController = require("./notificationController");
const postController = require("./postController");
const userController = require("./userController");
const roomCallController = require("./roomCallController");

module.exports = {
  authController,
  commentController,
  friendRequestController,
  imageController,
  conversationController,
  notificationController,
  postController,
  userController,
  messageController,
  roomCallController,
};
