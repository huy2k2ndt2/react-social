const mongoose = require("mongoose");
const { Schema } = mongoose;

const roomCallSchema = new Schema(
  {
    conversationId: {
      type: String,
      required: true,
    },
    isVideo: {
      type: Boolean,
      required: true,
    },
    userCreateId: {
      type: String,
      required: true,
    },
    roomCallId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("RoomCalls", roomCallSchema);
