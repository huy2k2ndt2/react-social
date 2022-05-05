const mongoose = require("mongoose");
const { Schema } = mongoose;

const roomCallSchema = new Schema(
  {
    members: {
      type: Array,
      default: [],
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
