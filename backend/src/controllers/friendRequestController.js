const FriendRequest = require("../models/friendRequest");
const User = require("../models/userModel");

require("dotenv").config();

const friendRequestController = {
  createFriendRequest: async (req, res, next) => {
    try {
      const { userId: senderId } = req;
      const { receiverId } = req.body;

      if (!senderId || !receiverId)
        throw new Error(
          "Unable to make friend request due to missing information"
        );

      const friendRequest = new FriendRequest({
        senderId,
        receiverId,
      });

      await friendRequest.save();

      res.json({
        message: "Create FriendRequest Success",
        friendRequestDb: friendRequest,
      });
    } catch (err) {
      next(err);
    }
  },

  refuseFriendRequest: async (req, res, next) => {
    try {
      const { userId } = req;
      const { friendRequestId } = req.body;

      if (!userId)
        throw new Error(
          "Id friend requst want refuse friend request not exist"
        );

      const friendRequest = await FriendRequest.findById(friendRequestId);

      if (userId !== friendRequest.receiverId)
        throw new Error("you do not have refuse to delete this friend request");

      await FriendRequest.findByIdAndUpdate(friendRequestId, {
        $set: { status: 2 },
      });

      res.json({
        message: "Refuse Friend request Success",
      });
    } catch (err) {
      next(err);
    }
  },

  refuseAllFriendRequest: async (req, res, next) => {
    try {
      const { userId } = req;

      const friendRequests = await FriendRequest.find({
        receiverId: userId,
        status: 1,
      });

      await Promise.all(
        friendRequests.map((friendRequest) => {
          return FriendRequest.findByIdAndUpdate(friendRequest._id.toString(), {
            $set: { status: 2 },
          });
        })
      );

      res.json({
        message: "Delete all friend Requests Success",
      });
    } catch (err) {
      next(err);
    }
  },

  updateFriendRequest: async (req, res, next) => {
    try {
      const { userId } = req;
      const { friendRequestId, ...info } = req.body;

      const friendRequest = await FriendRequest.findById(friendRequestId);

      if (friendRequest.senderId !== userId)
        throw new Error(
          "You cannot resend this friend request to the friend who requested it"
        );

      await FriendRequest.findByIdAndUpdate(friendRequestId, {
        $set: info,
      });

      res.json({
        message: "Update friend Requests Success",
      });
    } catch (err) {
      next(err);
    }
  },

  getAllFriendRequestReceived: async (req, res, next) => {
    try {
      const { userId: id } = req;

      if (!id)
        throw new Error(
          "Get all friend information failed due to missing id user"
        );

      const friendRequests = await FriendRequest.find({
        receiverId: id,
        status: 1,
      });

      res.json({
        message: "Get all Request friend received Success",
        friendRequests,
      });
    } catch (err) {
      next(err);
    }
  },

  getNumberFriendRequest: async (req, res, next) => {
    try {
      const { userId: id } = req;

      if (!id)
        throw new Error(
          "Get all friend information failed due to missing id user"
        );

      const friendRequests = await FriendRequest.find({
        receiverId: id,
        status: 1,
      });

      res.json({
        message: "Get all Request friend sent Success",
        number: friendRequests.length,
      });
    } catch (err) {
      next(err);
    }
  },

  getFriendRequest: async (req, res, next) => {
    try {
      const { friendId, type, status } = req.query;

      const { userId: id } = req;

      if (!id || !friendId || !type || !status)
        throw new Error(
          "Get friend request information failed due to missing id user"
        );

      const friendRequest =
        type === "sender"
          ? await FriendRequest.findOne({
              senderId: id,
              receiverId: friendId,
              status: Number(status),
            })
          : await FriendRequest.findOne({
              senderId: friendId,
              receiverId: id,
              status: Number(status),
            });

      res.json({
        message: "Get all Request friend sent Success",
        friendRequestDb: friendRequest,
        type,
      });
    } catch (err) {
      next(err);
    }
  },

  getAllFriendRequestSent: async (req, res, next) => {
    try {
      const { userId: id } = req;

      if (!id)
        throw new Error(
          "Get all friend information failed due to missing id user"
        );

      const friendRequests = await FriendRequest.find({
        senderId: id,
      });

      res.json({
        message: "Get all Request friend sent Success",
        friendRequests,
      });
    } catch (err) {
      next(err);
    }
  },

  deleteFriendRequest: async (req, res, next) => {
    try {
      const { userId } = req;
      const { friendRequestId } = req.params;

      if (!friendRequestId || !userId)
        throw new Error(
          "Delete friend request failed due to missing information"
        );

      const friendRequest = await FriendRequest.findById(friendRequestId);

      if (userId !== friendRequest.senderId)
        throw new Error(
          "You do not have permission to delete this friend request"
        );

      await FriendRequest.findByIdAndDelete(friendRequestId);

      res.json({
        message: "Friend request deleted",
      });
    } catch (err) {
      next(err);
    }
  },

  deleteAllFriendRequest: async (req, res, next) => {
    try {
      const { userId } = req;
      const { type } = req.query;

      const types = [0, 1, 2];

      if (!userId || !type || !types.includes(Number(type)))
        throw new Error(
          "Delete friend request failed due to missing information"
        );

      const friendRequests =
        Number(type) === 0
          ? await FriendRequest.find({ senderId: userId })
          : await FriendRequest.find({
              senderId: userId,
              status: Number(type),
            });

      await Promise.all(
        friendRequests.map((friendRequest) => {
          returnFriendRequest.findByIdAndDelete(friendRequest._id.toString());
        })
      );

      res.json({
        message: "Delete all friend Requests Success",
      });
    } catch (err) {
      next(err);
    }
  },

  acceptFriendRequest: async (req, res, next) => {
    try {
      const { userId } = req;
      const { friendId, friendRequestId } = req.body;

      if (!userId || !friendId || !friendRequestId)
        throw new Error("Unable to perform due to lack of data");

      const friendRequest = await FriendRequest.findById(friendRequestId);

      if (
        friendRequest.receiverId !== userId ||
        friendRequest.senderId !== friendId
      )
        throw new Error(
          "Unable to make friend request due to wrong information"
        );

      const userSender = await User.findById(userId);
      const userReceiver = await User.findById(friendId);

      if (!userSender || !userReceiver)
        throw new Error(
          "An error occurred, the user cannot be found in the system"
        );

      if (
        userSender?.friends?.includes(friendId) ||
        userReceiver?.friends?.includes(userId)
      )
        throw new Error(
          "The request cannot be fulfilled because this person is already in the friends list"
        );

      await Promise.all([
        await userSender.updateOne({
          $push: { friends: friendId },
        }),
        await userReceiver.updateOne({
          $push: { friends: userId },
        }),
        await FriendRequest.findByIdAndDelete(friendRequestId),
      ]);

      if (
        !userSender.followings.includes(friendId) &&
        !userReceiver.followers.includes(userId)
      ) {
        await Promise.all([
          await userSender.updateOne({
            $push: { followings: friendId },
          }),
          await userReceiver.updateOne({
            $push: { followers: userId },
          }),
        ]);
      }

      if (
        !userReceiver.followings.includes(userId) &&
        !userSender.followers.includes(friendId)
      ) {
        await Promise.all([
          await userReceiver.updateOne({
            $push: { followings: userId },
          }),
          await userSender.updateOne({
            $push: { followers: friendId },
          }),
        ]);
      }

      res.json({
        message: "Accept friend request success",
      });
    } catch (err) {
      next(err);
    }
  },

  unFriend: async (req, res, next) => {
    try {
      const { userId } = req;
      const { friendId } = req.body;

      if (!userId || !friendId)
        throw new Error("Unable to perform due to lack of data");

      const user = await User.findById(userId);
      const friend = await User.findById(friendId);

      if (!user || !friend)
        throw new Error(
          "An error occurred, the user cannot be found in the system"
        );

      if (
        !user?.friends?.includes(friendId) ||
        !friend?.friends?.includes(userId)
      )
        throw new Error(
          "The request cannot be made because you are not friends with this person"
        );

      await Promise.all([
        await user.updateOne({
          $pull: { friends: friendId },
        }),
        await friend.updateOne({
          $pull: { friends: userId },
        }),
      ]);

      res.json({
        message: "unFriend success",
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = friendRequestController;
