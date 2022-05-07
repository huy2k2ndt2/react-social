const RomCall = require("../models/roomCallModel");

const roomCallController = {
  createRoomCall: async (req, res, next) => {
    try {
      const roomCall = new RomCall(req.body);
      await roomCall.save();

      res.json({
        message: "Create room call Success",
        roomCall,
      });
    } catch (err) {
      next(err);
    }
  },
  getRoomChat: async (req, res, next) => {
    try {
      const { roomCallId, conversationId } = req.query;

      let roomCall;
      if (roomCallId) {
        roomCall = await RomCall.findOne({ roomCallId });
      } else {
        roomCall = await RomCall.findOne({
          conversationId,
        });
      }

      res.json({
        message: "Get room Call Success",
        roomCall,
      });
    } catch (err) {
      next(err);
    }
  },

  deleteRoomCall: async (req, res, next) => {
    try {
      const { isAllow, roomCallId, userId, conversationId } = req.query;

      if (isAllow) {
        const roomCall = await RomCall.findOne({ roomCallId, conversationId });

        await RomCall.deleteOne({ roomCallId, conversationId });
      } else {
        const roomCall = await RomCall.findOne({ roomCallId, conversationId });

        if (!roomCall) throw new Error("Not found room chat want delete");

        if (roomCall.userCreateId === userId) {
          await RomCall.deleteOne({ roomCallId, conversationId });
        } else {
          throw new Error("You do not have permission to delete any room");
        }
      }

      res.json({
        message: "Delete room call Success",
      });
    } catch (err) {
      next(err);
    }
  },
  addMember: async (req, res, next) => {
    try {
      const { userId, roomCallId } = req.body;

      await RomCall.findByIdAndUpdate(roomCallId, {
        $push: { members: userId },
      });

      res.json({
        message: "Add user to chat room successfully",
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = roomCallController;
