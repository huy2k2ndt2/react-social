const express = require("express");
const { notificationController } = require("../../controllers");
const { vertifyToken } = require("../../middlewares/vertifyToken");

const notificationRouter = express.Router();

notificationRouter.post(
  "/",
  vertifyToken,
  notificationController.createNotification
);
notificationRouter.get(
  "/get-number-notification-not-read",
  vertifyToken,
  notificationController.getNotificationsNotRead
);
notificationRouter.get(
  "/",
  vertifyToken,
  notificationController.getNotifications
);
notificationRouter.delete(
  "/delete-all-notification",
  vertifyToken,
  notificationController.removeAllNotifications
);

notificationRouter.delete(
  "/:notificationId",
  vertifyToken,
  notificationController.deleteNotification
);

notificationRouter.put(
  "/read-all-notification",
  vertifyToken,
  notificationController.updateReadAllNotification
);

notificationRouter.put(
  "/:notificationId",
  vertifyToken,
  notificationController.updateReadNotification
);

notificationRouter.put(
  "/unRead/:notificationId",
  vertifyToken,
  notificationController.unReadNotification
);
module.exports = notificationRouter;
