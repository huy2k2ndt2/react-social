const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    images: {
      type: Array,
      default: [],
    },
    likes: {
      type: Array,
      default: [],
    },
    tags: {
      type: Array,
      default: [],
    },
    userId: {
      type: String,
      require: true,
    },
    postId: {
      type: String,
      require: true,
    },
    replys: {
      type: Array,
      default: [],
    },
    text: {
      type: String,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Comment", commentSchema);
