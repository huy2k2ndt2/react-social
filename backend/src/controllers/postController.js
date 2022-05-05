const Post = require("../models/postModel");
const User = require("../models/userModel");
const Comment = require("../models/commentModel");
const fs = require("fs");
const { removeImage } = require("../common/image");

const postController = {
  createPost: async (req, res, next) => {
    try {
      const newPost = new Post(req.body);
      await newPost.save();

      res.json({ message: "Create post Success", post: newPost });
    } catch (err) {
      next(err);
    }
  },
  addComment: async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { commentId } = req.body;

      const post = await Post.findById(postId);

      if (!post) {
        return res.status(403).json({
          message: "The post you like add comment not exist",
        });
      }

      await post.updateOne({
        $push: { comments: commentId },
      });

      res.json({
        message: "Add a comment to the post successfully",
      });
    } catch (err) {
      next(err);
    }
  },
  removeComment: async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { commentId } = req.body;
      const { userId } = req;
      const post = await Post.findById(postId);

      if (!post) {
        return res.status(403).json({
          message: "The post you remove comment does not exist",
        });
      }

      const comment = await Comment.findById(commentId);

      if (!comment) {
        return res.status(403).json({
          message: "The comment remove does not exist",
        });
      }

      if (comment.userId !== userId) {
        return res.status(500).json({
          message: "You cannot delete other people's comments",
        });
      }

      const imagesDelete = comment.images.map((image) => image.public_id);

      const commentReplys = await Promise.all(
        comment.replys.map((commentReplyId) => {
          return Comment.findById(commentReplyId);
        })
      );

      commentReplys.forEach((commentReply) => {
        commentReply.images.forEach((image) => {
          imagesDelete.push(image.public_id);
        });
      });

      removeImage(imagesDelete);

      await Promise.all(
        comment.replys.map((commentReplyId) => {
          return Comment.findByIdAndDelete(commentReplyId);
        })
      );

      await post.updateOne({
        $pull: { comments: commentId },
      });

      await Comment.findByIdAndDelete(commentId);

      res.json({
        message: "Delete comment on post successfully",
      });
    } catch (err) {
      next(err);
    }
  },

  removeImages: async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { images } = req.body;
      const { userId } = req;
      const post = await Post.findById(postId);

      if (!post) {
        return res.status(403).json({
          message: "The post you update does not exist",
        });
      }

      if (post.userId !== userId) {
        return res.status(404).json({
          message: "You can only delete your posts",
        });
      }

      res.json({ message: "Delete images post Success" });
    } catch (err) {
      next(err);
    }
  },

  updatePost: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { userId } = req;

      const post = await Post.findById(id);

      if (post.userId !== userId) {
        return res.status(404).json({
          message: "You can only update your posts",
        });
      }

      const postUpdate = await Post.findByIdAndUpdate(
        id,
        {
          $set: req.body,
        },
        { new: true }
      );

      res.json({ message: "Update post Success", newPost: postUpdate });
    } catch (err) {
      next(err);
    }
  },
  deletePost: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { userId } = req;
      const post = await Post.findById(id);

      if (post.userId !== userId) {
        return res.status(404).json({
          message: "You can only delete your posts",
        });
      }

      const comments = await Comment.find({ postId: id });

      const imagesDelete = post.images.map((image) => image.public_id);

      comments.forEach((comment) => {
        comment.images.forEach((image) => {
          imagesDelete.push(image.public_id);
        });
      });

      removeImage(imagesDelete);

      await Promise.all(
        comments.map((comment) => Comment.findByIdAndDelete(comment._id))
      );

      await Post.findByIdAndDelete(id);

      res.json({ message: "Delete post Success" });
    } catch (err) {
      next(err);
    }
  },
  likePost: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { userId } = req;

      const postLike = await Post.findById(id);

      if (!postLike) {
        return res.status(403).json({
          message: "The post you like does not exist",
        });
      }

      if (postLike.likes.includes(userId)) {
        return res.status(403).json({
          message: "You already like this post",
        });
      }

      await postLike.updateOne({
        $push: { likes: userId },
      });

      res.json({
        message: "Like post Success",
      });
    } catch (err) {
      next(err);
    }
  },
  disLikePost: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { userId } = req;

      const postDisLike = await Post.findById(id);

      if (!postDisLike) {
        return res.status(403).json({
          message: "The post you dislike does not exist",
        });
      }

      if (!postDisLike.likes.includes(userId)) {
        return res.status(403).json({
          message: "You haven't liked this post yet",
        });
      }

      await postDisLike.updateOne({
        $pull: { likes: userId },
      });

      res.json({
        message: "DisLike post Success",
      });
    } catch (err) {
      next(err);
    }
  },
  getPost: async (req, res, next) => {
    try {
      const { id } = req.params;
      const post = await Post.findById(id);
      res.json({ message: "Get post Success", post });
    } catch (err) {
      next(err);
    }
  },
  getAllPost: async (req, res, next) => {
    try {
      const { userId } = req.params;
      const userCurrent = await User.findById(userId);
      const userCurrentPosts = await Post.find({
        userId,
      });

      const friendPosts = await Promise.all(
        userCurrent.followings.map((friendId) =>
          Post.find({ userId: friendId })
        )
      );

      res.json({
        message: "Get all post Success",
        posts: userCurrentPosts.concat(...friendPosts),
      });
    } catch (err) {
      next(err);
    }
  },
  getUserPosts: async (req, res, next) => {
    try {
      const { userName } = req.params;

      const user = await User.findOne({
        userName,
      });

      const posts = await Post.find({
        userId: user._id,
      });

      res.json({
        message: "Get all post Success",
        posts,
      });
    } catch (err) {
      next(err);
    }
  },
  getAllComments: async (req, res, next) => {
    try {
      const { postId } = req.params;

      const post = await Post.findById(postId);

      if (!post) {
        return res.status(403).json({
          message: "The post you like get comments not exist",
        });
      }

      const comments = await Promise.all(
        post.comments.map((commentId) => Comment.findById(commentId))
      );

      res.json({
        message: "Get all comments Success",
        comments,
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = postController;
