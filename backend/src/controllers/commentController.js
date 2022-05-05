const Comment = require("../models/commentModel");
const removeImage = require("../common/image");

const commentController = {
  createComment: async (req, res, next) => {
    try {
      const newComment = new Comment(req.body);

      await newComment.save();

      res.json({
        message: "Create comment Success",
        comment: newComment,
      });
    } catch (err) {
      next(err);
    }
  },
  deleteComments: async (req, res, next) => {
    try {
      const { userId, commentId } = req.params;

      const comment = await Comment.findById(commentId);

      if (!comment)
        return res.status(404).json({
          message: "Comment not found",
        });

      if (comment.userId !== userId) {
        return res.status(500).json({
          message: "You cannot delete other people's comments",
        });
      }

      await Promise.all(
        comment.replys.map((commentReplyId) => {
          return Comment.findByIdAndDelete(commentReplyId);
        })
      );

      await Comment.findByIdAndDelete(commentId);

      res.json({
        message: "Delete commnets Success",
      });
    } catch (err) {
      next(err);
    }
  },
  deleteCommentsPost: async (req, res, next) => {
    try {
      const { postId } = req.params;

      const comments = await Comment.find({ postId });

      await Promise.all(
        comments.map((comment) => {
          return Comment.findByIdAndDelete(comment._id.toString());
        })
      );

      res.json({
        message: "Delete all post comments Success",
      });
    } catch (err) {
      next(err);
    }
  },
  likeComment: async (req, res, next) => {
    try {
      const { userId } = req.body;
      const { commentId } = req.params;

      const comment = await Comment.findById(commentId);

      if (!comment)
        return res.status(404).json({
          message: "Comment not found",
        });

      if (comment.likes.includes(userId)) {
        return res.status(500).json({
          message: "You liked this comment",
        });
      }

      await comment.updateOne({
        $push: { likes: userId },
      });

      res.json({
        message: "Like comment Success",
      });
    } catch (err) {
      next(err);
    }
  },
  unLikeComment: async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const { userId } = req.body;

      const commentUnLike = await Comment.findById(commentId);

      if (!commentUnLike) {
        return res.status(404).json({
          message: "The comment you unlike does not exist",
        });
      }

      if (!commentUnLike.likes.includes(userId)) {
        return res.status(500).json({
          message: "You haven't liked this comment yet",
        });
      }

      await commentUnLike.updateOne({
        $pull: { likes: userId },
      });

      res.json({
        message: "UnLike comment Success",
      });
    } catch (err) {
      next(err);
    }
  },
  updateComment: async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const { userId } = req.body;

      const comment = await Comment.findById(commentId);

      if (comment.userId !== userId) {
        return res.status(404).json({
          message: "You cannot update other people's comments",
        });
      }

      const commentUpdate = await Comment.findByIdAndUpdate(
        commentId,
        {
          $set: req.body,
        },
        { new: true }
      );

      res.json({
        message: "Update comment Success",
        newComment: commentUpdate,
      });
    } catch (err) {
      next(err);
    }
  },
  getAllComments: async (req, res, next) => {
    try {
      const { postId } = req.params;

      const comments = await Comment.find({ postId });

      res.json({
        message: "Get all comments Success",
        comments,
      });
    } catch (err) {
      next(err);
    }
  },
  getAllCommentsReply: async (req, res, next) => {
    try {
      const { commentId } = req.params;

      const comment = await Comment.findById(commentId);

      const commentsReply = await Promise.all(
        comment.replys.map((commentReplyId) => {
          return Comment.findById(commentReplyId);
        })
      );

      res.json({
        message: "Get all comments reply Success",
        comments: commentsReply,
      });
    } catch (err) {
      next(err);
    }
  },
  addCommentReply: async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const { commentReplyId } = req.body;

      const comment = await Comment.findById(commentId);

      if (!comment) {
        return res.status(403).json({
          message: "The comment not exist",
        });
      }

      await comment.updateOne({
        $push: { replys: commentReplyId },
      });

      res.json({
        message: "Add a commentReply to the comment successfully",
      });
    } catch (err) {
      next(err);
    }
  },
  removeCommentReply: async (req, res, next) => {
    try {
      const { commentReplyId, userId, commentId } = req.params;

      const commentReply = await Comment.findById(commentReplyId);
      const comment = await Comment.findById(commentId);

      if (!comment || !commentReply) {
        return res.status(403).json({
          message: "The comment not exist",
        });
      }

      if (commentReply.userId !== userId) {
        return res.status(500).json({
          message: "You cannot delete other people's comments",
        });
      }

      const imagesDelete = commentReply.images.map((image) => image.public_id);

      removeImage(imagesDelete);

      await comment.updateOne({
        $pull: { replys: commentReplyId },
      });

      await Comment.findByIdAndDelete(commentReplyId);

      res.json({
        message: "Remove a commentReply to the comment successfully",
      });
    } catch (err) {
      next(err);
    }
  },

  removeImages: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { userId } = req;
      const { images } = req.body;
      const comment = await Comment.findById(id);

      if (!comment) {
        return res.status(403).json({
          message: "The comment you update does not exist",
        });
      }

      if (comment.userId !== userId) {
        return res.status(404).json({
          message: "You can only delete your posts",
        });
      }

      res.json({ message: "Delete images comment Success" });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = commentController;
