const express = require("express");
const { imageController } = require("../../controllers");
const { vertifyToken } = require("../../middlewares/vertifyToken");

const imageRouter = express.Router();

imageRouter.post("/upload", imageController.upload);

imageRouter.delete("/", vertifyToken, imageController.deleteImage);
imageRouter.delete(
  "/delete-list-image",
  vertifyToken,
  imageController.deleteListImage
);

module.exports = imageRouter;
