const Conversation = require("../models/conversationModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

const conversationController = {
  createConversation: async (req, res, next) => {
    try {
      const { senderId, receiverId } = req.body;

      const conversation = await new Conversation({
        members: [senderId, receiverId],
        reads: [true, true],
      });

      await conversation.save();
      res.json({
        message: "Create conversation Success",
        conversation,
      });
    } catch (err) {
      next(err);
    }
  },
  getConversations: async (req, res, next) => {
    try {
      const { userId } = req;

      const conversationDb = await Conversation.find({
        members: { $in: [userId] },
      });

      const friendsChatId = conversationDb.map((conversation) => {
        const friend = conversation.members.find(
          (memberId) => memberId !== userId
        );

        return friend;
      });

      let lastMessages = await Promise.all(
        conversationDb.map((conversation) => {
          return Message.find({ conversationId: conversation._id })
            .sort({ _id: -1 })
            .limit(1);
        })
      );

      lastMessages = lastMessages.reduce((prevState, messages) => {
        return [...prevState, ...messages];
      }, []);

      const friends = await Promise.all(
        friendsChatId.map((friendId) => User.findById(friendId))
      );

      const conversations = friends.map((friend) => {
        const conversation = conversationDb.find((conversationDb) =>
          conversationDb.members.includes(friend?._id)
        );

        const lastMessage = lastMessages.find(
          (message) => message.conversationId === conversation._id.toString()
        );

        const data = {
          ...conversation._doc,
          friend,
          lastMessage,
        };

        return data;
      });

      res.json({
        message: "Get conversations Success",
        conversations,
      });
    } catch (err) {
      next(err);
    }
  },
  conversationController: async (req, res, next) => {
    try {
      const { conversationId, roomCallId } = req.body;

      await Conversation.findByIdAndUpdate(conversationId, {
        $set: { roomCallId },
      });

      res.json({
        message: "update room call id to conversation successfully",
      });
    } catch (err) {
      next(err);
    }
  },
  updateConversation: async (req, res, next) => {
    try {
      const {
        userId,
        receiverId,
        conversationId,
        isRead,
        lastMessage,
        isStatus,
      } = req.body;

      const conversationsDb = await Conversation.findById(conversationId);

      if (!conversationsDb) {
        throw new Error(`Conversations in exits`);
      }

      if (receiverId || userId) {
      }

      const idx = conversationsDb.members.indexOf(receiverId || userId);

      const data = {};

      if (isRead === false || isRead === true) {
        const reads = [...conversationsDb.reads];
        reads[idx] = isRead;
        data.reads = reads;
      }

      if (isStatus) {
        const status = [...conversationsDb.status];
        status[idx] = isStatus;
        data.status = status;
      }

      if (lastMessage) data.lastMessage = lastMessage;

      const newConversation = await Conversation.findByIdAndUpdate(
        conversationId,
        {
          $set: data,
        },
        {
          new: true,
        }
      );

      res.json({
        message: "Update conversations Success",
        newConversation,
      });
    } catch (err) {
      next(err);
    }
  },
  getConversationUnwatch: async (req, res, next) => {
    try {
      const { userId } = req;

      const conversationsDb = await Conversation.find({
        members: { $in: [userId] },
      });

      const data = conversationsDb.map((conversation) => {
        const idx = conversation.members.indexOf(userId);
        return {
          conversationId: conversation._id,
          isRead: conversation.reads[idx],
        };
      });

      res.json({
        message: "Get number conversation unwatch Success",
        conversations: data,
      });
    } catch (err) {
      next(err);
    }
  },

  getConversation: async (req, res, next) => {
    try {
      const { receiverId, isFriend } = req.query;

      const { userId: userCurrentId } = req;

      if (!receiverId || !userCurrentId)
        throw new Error(`Can't get the room due to wrong user id information`);

      let conversationDb = await Conversation.findOne({
        members: { $all: [userCurrentId, receiverId] },
      });

      if (!conversationDb) {
        conversationDb = await new Conversation({
          members: [userCurrentId, receiverId],
          reads: [true, true],
          status: [true, isFriend === "true" ? true : false],
        });

        await conversationDb.save();
      }

      const friendChat = await User.findById(receiverId);

      res.json({
        message: "Get conversations Success",
        conversation: {
          ...conversationDb._doc,
          friend: friendChat,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  updateRoomCallId: async (req, res, next) => {
    try {
      const { roomCallId, conversationId, isReset } = req.body;

      console.log(" req.body", req.body);

      if (!roomCallId && !isReset) {
        throw new Error(`Missing room call Id`);
      }

      const newConversation = await Conversation.findByIdAndUpdate(
        conversationId,
        {
          $set: { roomCallId },
        },
        { new: true }
      );

      res.json({
        message: "Update room call conversation Success",
        newConversation,
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = conversationController;
