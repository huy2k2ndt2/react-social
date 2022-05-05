const bcrypt = require("bcrypt");
const User = require("../models/userModel");
var fs = require("fs");

const userController = {
  updatePassword: async (req, res, next) => {
    const { userId: id } = req;
    const { userId, isAdmin, newPassword } = req.body;
    if (id === userId || isAdmin) {
      try {
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hash(newPassword, salt);
        await User.findByIdAndUpdate(id, {
          $set: { password: hashPassword },
        });
        res.json({
          message: "Update password Success",
        });
      } catch (err) {
        next(err);
      }
    } else {
      next(new Error("Can not reset password"));
    }
  },

  updateLastLogin: async (req, res, next) => {
    const { userId: id, lastLogin } = req.body;

    if (!id || !lastLogin) throw new Error("Invalid user id");

    try {
      await User.findByIdAndUpdate(id, {
        $set: { lastLogin },
      });
      res.json({
        message: "Update last login  Success",
      });
    } catch (err) {
      next(err);
    }
  },

  updateUser: async (req, res, next) => {
    try {
      const { userId: id } = req;
      const { userId, isAdmin } = req.body;

      if (id === userId || isAdmin) {
        const { userId, ...newInfo } = req.body;

        const userUpdate = await User.findByIdAndUpdate(
          id,
          {
            $set: newInfo,
          },
          { new: true }
        );

        return res.json({
          message: "Update info success",
          user: userUpdate,
        });
      } else {
        return res.status(401).json({
          message: "Can not update info",
        });
      }
    } catch (err) {
      next(err);
    }
  },
  // deleteUser: async (req, res ,next) => {
  //   try {
  //     const { id } = req.params;
  //     const { userId, isAdmin } = req.body;

  //     if (id === userId || isAdmin) {
  //       await User.findByIdAndDelete(id);

  //       return res.json({
  //         message: "Delete user success",
  //       });
  //     } else {
  //       return res.status(401).json({
  //         message: "Can not delete user ",
  //       });
  //     }
  //   } catch (err) {
  //     res.status(404).json({
  //       err,
  //     });
  //   }
  // },
  getUser: async (req, res, next) => {
    try {
      const { userId, userName } = req.query;

      const user = userId
        ? await User.findById(userId)
        : await User.findOne({
            userName,
          });

      if (!user) next(new Error("Get user Failed"));

      const { password, updatedAt, createdAt, ...other } = user._doc;

      return res.json({
        message: "get user success",
        user: other,
      });
    } catch (err) {
      next(err);
    }
  },
  followUser: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { userId } = req;
      if (id === userId) {
        return res.status(403).json({
          message: "You can follow yourself",
        });
      }

      const userFollow = await User.findById(id);
      const userCurrent = await User.findById(userId);

      if (!userFollow) {
        return res.status(403).json({
          message: "The user you follow does not exist",
        });
      }

      if (userFollow.followers.includes(userId)) {
        return res.status(403).json({
          message: "You already follow this user",
        });
      }

      await userFollow.updateOne({
        $push: { followers: userId },
      });

      await userCurrent.updateOne({
        $push: { followings: id },
      });

      res.json({
        message: "Follow Success",
      });
    } catch (err) {
      next(err);
    }
  },
  unFollowUser: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { userId } = req;
      if (id === userId) {
        return res.status(403).json({
          message: "You can unfollow yourself",
        });
      }

      const userUnFollow = await User.findById(id);
      const userCurrent = await User.findById(userId);

      if (!userUnFollow) {
        return res.status(403).json({
          message: "The user you unfollow does not exist",
        });
      }

      if (!userUnFollow.followers.includes(userId)) {
        return res.status(403).json({
          message:
            "You can't unfollow this person because you haven't followed ",
        });
      }

      await userUnFollow.updateOne({
        $pull: { followers: userId },
      });

      await userCurrent.updateOne({
        $pull: { followings: id },
      });

      res.json({
        message: "Unfollow Success",
      });
    } catch (err) {
      next(err);
    }
  },
  getFollowings: async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const friends = await Promise.all(
        user.followings.map((friendId) => {
          return User.findById(friendId);
        })
      );

      res.json({
        message: "Get friend Success",
        friends: friends.map((friend) => {
          const { _id, userName, profilePicture } = friend;
          return { _id, userName, profilePicture };
        }),
      });
    } catch (err) {
      next(err);
    }
  },
  getFriends: async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const friends = await Promise.all(
        user.friends.map((friendId) => {
          return User.findById(friendId);
        })
      );

      res.json({
        message: "Get friend Success",
        friends: friends.map((friend) => {
          const { _id, userName, profilePicture, lastLogin } = friend;
          return { _id, userName, profilePicture, lastLogin };
        }),
      });
    } catch (err) {
      next(err);
    }
  },
  getUsersSuggestion: async (req, res, next) => {
    try {
      const { userId: id } = req;

      if (!id)
        throw new Error(
          `Get user friend suggestion failed because id not exist`
        );

      const usersDb = await User.find({
        friends: { $nin: [id] },
      });

      const users = usersDb.filter((user) => user._id.toString() !== id);

      res.json({
        message: "Get user suggestion Success",
        users: users.map((user) => {
          const { _id, userName, profilePicture } = user;
          return { _id, userName, profilePicture };
        }),
      });
    } catch (err) {
      next(err);
    }
  },

  searchUsers: async (req, res, next) => {
    try {
      const { textSearch } = req.params;

      const users = await User.find({
        keys: { $in: [textSearch] },
      });

      res.json({
        message: "Search User Success",
        users,
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = userController;
