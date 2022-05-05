const { removeImage } = require("../common/image");
const Message = require("../models/messageModel");

const conversationController = {
  createMessage: async (req, res, next) => {
    try {
      const newMessage = await new Message(req.body);

      await newMessage.save();
      res.json({
        message: "Create Message Success",
        newMessage,
      });
    } catch (err) {
      next(err);
    }
  },
  getMessages: async (req, res, next) => {
    try {
      const { conversationId } = req.params;

      const messages = await Message.find({ conversationId });

      res.json({
        message: "Get messages Success",
        messages,
      });
    } catch (err) {
      next(err);
    }
  },
  getMessagesNotRead: async (req, res, next) => {
    try {
      const { userId } = req;

      const messages = await Message.find({
        receivers: { $in: [userId] },
      });

      const numberMessageNotRead = messages.filter((message) => {
        const idx = message.receivers.indexOf(userId);
        return !message.reads[idx];
      }).length;

      res.json({
        message: "Get number message not read Success",
        count: numberMessageNotRead,
      });
    } catch (err) {
      next(err);
    }
  },
  updateReadMessage: async (req, res, next) => {
    try {
      const { messageId, receiverId } = req.body;

      const message = await Message.findById(messageId);

      const idx = message.receivers.indexOf(receiverId);

      const reads = [...message.reads];
      reads[idx] = true;

      await message.update({
        $set: { reads },
      });

      res.json({
        message: "Update read message successfully",
      });
    } catch (err) {
      next(err);
    }
  },

  deleteMessage: async (req, res, next) => {
    try {
      const { userId } = req;
      const { messageId } = req.params;
      if (!userId || !messageId)
        throw new Error(
          `Message cannot be recovered due to lack of information`
        );

      const message = await Message.findById(messageId);

      if (!message)
        throw new Error(`The message to be deleted could not be found`);

      if (userId !== message.senderId) {
        throw new Error("You do not have permission to revoke this message");
      }

      const imagesDelete = message.images.map((image) => image.public_id);

      removeImage(imagesDelete);

      const newMessage = await Message.findByIdAndUpdate(
        messageId,
        {
          $set: {
            images: [],
            senderId: userId,
            conversationId: message.conversationId,
            text: "Message has been revoked",
            isDeleted: true,
          },
        },
        { new: true }
      );

      res.json({
        message: "Delete message successfully",
        newMessage,
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = conversationController;
