const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    conversationId: {
      type: String,
      require: true,
    },
    senderId: {
      type: String,
    },
    // receivers: { type: Array, default: [] },
    // reads: { type: Array, default: [] },
    images: { type: Array, default: [] },
    text: { type: String },
    isNotify: { type: Boolean, default: false },
    notify: { type: Array },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("message", messageSchema);
