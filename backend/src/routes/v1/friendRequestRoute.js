const express = require("express");
const { friendRequestController } = require("../../controllers");
const { vertifyToken } = require("../../middlewares/vertifyToken");

const friendRequestRouter = express.Router();

friendRequestRouter.get(
  "/get-all-requests-sent",
  vertifyToken,
  friendRequestController.getAllFriendRequestSent
);

friendRequestRouter.get(
  "/get-all-requests-received",
  vertifyToken,
  friendRequestController.getAllFriendRequestReceived
);

friendRequestRouter.get(
  "/get-number",
  vertifyToken,
  friendRequestController.getNumberFriendRequest
);

friendRequestRouter.get(
  "/",
  vertifyToken,
  friendRequestController.getFriendRequest
);

friendRequestRouter.post(
  "/",
  vertifyToken,
  friendRequestController.createFriendRequest
);

friendRequestRouter.put(
  "/refuse-request",
  vertifyToken,
  friendRequestController.refuseFriendRequest
);

friendRequestRouter.put(
  "/refuse-all-request",
  vertifyToken,
  friendRequestController.refuseAllFriendRequest
);

friendRequestRouter.put(
  "/",
  vertifyToken,
  friendRequestController.updateFriendRequest
);

friendRequestRouter.delete(
  "/:friendRequestId",
  vertifyToken,
  friendRequestController.deleteFriendRequest
);

friendRequestRouter.delete(
  "/delete-all-request/:type",
  vertifyToken,
  friendRequestController.deleteFriendRequest
);

friendRequestRouter.put(
  "/accept-friend-request",
  vertifyToken,
  friendRequestController.acceptFriendRequest
);

friendRequestRouter.put(
  "/unfriend",
  vertifyToken,
  friendRequestController.unFriend
);

module.exports = friendRequestRouter;
