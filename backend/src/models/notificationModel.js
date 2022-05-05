const mongoose = require("mongoose");
const { Schema } = mongoose;

const notificationSchema = new Schema(
  {
    link: {
      type: String,
      require: true,
    },
    senderId: {
      type: String,
      require: true,
    },
    receiverId: {
      type: String,
      require: true,
    },
    isRead: { type: Boolean, default: false },
    text: { type: String, require: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("notification", notificationSchema);
