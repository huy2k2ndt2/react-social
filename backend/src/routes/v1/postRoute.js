const express = require("express");
const { postController } = require("../../controllers");
const { vertifyToken } = require("../../middlewares/vertifyToken");

const postRouter = express.Router();

postRouter.post(
  "/add-comment/:postId",
  vertifyToken,
  postController.addComment
);
postRouter.post(
  "/remove-comment/:postId",
  vertifyToken,
  postController.removeComment
);
postRouter.post(
  "/remove-images/:postId",
  vertifyToken,
  postController.removeImages
);

postRouter.post("/", vertifyToken, postController.createPost);

postRouter.put("/like-post/:id", vertifyToken, postController.likePost);
postRouter.put("/dislike-post/:id", vertifyToken, postController.disLikePost);
postRouter.put("/:id", vertifyToken, postController.updatePost);

postRouter.delete("/:id", vertifyToken, postController.deletePost);

postRouter.get(
  "/get-all-post/:userId",
  vertifyToken,
  postController.getAllPost
);
postRouter.get(
  "/get-all-comment/:postId",
  vertifyToken,
  postController.getAllComments
);
postRouter.get("/profile/:userName", vertifyToken, postController.getUserPosts);
postRouter.get("/:id", vertifyToken, postController.getPost);

module.exports = postRouter;
