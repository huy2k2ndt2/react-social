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
      const { roomCallId } = req.params;

      const roomCall = await RomCall.findById(roomCallId);

      res.json({
        message: "Get room Call not read Success",
        roomCall,
      });
    } catch (err) {
      next(err);
    }
  },

  deleteRoomCall: async (req, res, next) => {
    try {
      const { isAllow, roomCallId, userId } = req.params;

      if (isgrantPermission) {
        await RomCall.findByIdAndDelete(roomCallId);
      } else {
        const roomCall = await RomCall.findById(roomCallId);

        if (roomCall.userCreateId === userId) {
          await RomCall.findByIdAndDelete(roomCallId);
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
