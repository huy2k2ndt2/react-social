const mongoose = require("mongoose");
const { Schema } = mongoose;

const friendRequestSchema = new Schema(
  {
    senderId: {
      type: String,
      required: true,
    },
    receiverId: {
      type: String,
      required: true,
    },
    status: {
      // 1: pending , 2: refuse
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FriendRequest", friendRequestSchema);
