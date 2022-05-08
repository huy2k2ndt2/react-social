const mongoose = require("mongoose");
const { Schema } = mongoose;

const conversationSchema = new Schema(
  {
    members: {
      type: Array,
      default: [],
    },
    image: {
      type: Array,
    },
    reads: {
      type: Array,
      default: [],
    },
    status: {
      type: Array,
      default: [],
    },
    roomCallId: {
      type: String,
    },
    name: {
      type: String,
      default: "",
    },
    desc: {
      type: String,
      default: "",
    },
    isMultiple: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Conversation", conversationSchema);
