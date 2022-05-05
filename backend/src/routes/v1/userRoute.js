const express = require("express");
const { userController } = require("../../controllers");
const { vertifyToken } = require("../../middlewares/vertifyToken");

const userRouter = express.Router();

userRouter.put("/update-password", vertifyToken, userController.updatePassword);
userRouter.put("/update-lastLogin", userController.updateLastLogin);
userRouter.patch("/update-user", vertifyToken, userController.updateUser);
// userRouter.delete("/:id", vertifyToken, userController.deleteUser);
userRouter.get("/", vertifyToken, userController.getUser);
userRouter.put("/follow/:id", vertifyToken, userController.followUser);
userRouter.put("/unfollow/:id", vertifyToken, userController.unFollowUser);
userRouter.get(
  "/get-followings/:id",
  vertifyToken,
  userController.getFollowings
);
userRouter.get("/get-friends/:id", vertifyToken, userController.getFriends);
userRouter.get(
  "/search-user/:textSearch",
  vertifyToken,
  userController.searchUsers
);
userRouter.get(
  "/get-users-suggestion/:id",
  vertifyToken,
  userController.getUsersSuggestion
);

module.exports = userRouter;
