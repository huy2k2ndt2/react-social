const mongoose = require("mongoose");
const { Schema } = mongoose;

const conversationSchema = new Schema(
  {
    members: {
      type: Array,
      default: [],
    },
    reads: {
      type: Array,
      default: [],
    },
    lastMessage: {
      type: Array,
      default: [],
    },
    status: {
      type: Array,
      default: [],
    },
    roomCallId: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Conversation", conversationSchema);
