const express = require("express");
const { commentController } = require("../../controllers");
const { vertifyToken } = require("../../middlewares/vertifyToken");

const commentRoute = express.Router();

commentRoute.get(
  "/get-all-comments-reply/:commentId",
  vertifyToken,
  commentController.getAllCommentsReply
);
commentRoute.get("/:postId", vertifyToken, commentController.getAllComments);

commentRoute.post("/", vertifyToken, commentController.createComment);
commentRoute.post(
  "/remove-images/:id",
  vertifyToken,
  commentController.removeImages
);

commentRoute.post(
  "/add-comment-reply/:commentId",
  vertifyToken,
  commentController.addCommentReply
);
commentRoute.delete(
  "/remove-comment-reply/:commentId/:commentReplyId/:userId",
  vertifyToken,
  commentController.removeCommentReply
);

commentRoute.delete(
  "/delete-comments/:commentId/:userId",
  vertifyToken,
  commentController.deleteComments
);
commentRoute.delete(
  "/delete-post-comment/:postId",
  vertifyToken,
  commentController.deleteCommentsPost
);

commentRoute.put(
  "/update-comment/:commentId",
  vertifyToken,
  commentController.updateComment
);

commentRoute.put(
  "/like-comment/:commentId",
  vertifyToken,
  commentController.likeComment
);
commentRoute.put(
  "/unLike-comment/:commentId",
  vertifyToken,
  commentController.unLikeComment
);

module.exports = commentRoute;
