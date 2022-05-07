const express = require("express");

const routes = express.Router();

routes.use("/auth", require("./authRoute"));
routes.use("/image", require("./imageRouter"));
routes.use("/user", require("./userRoute"));
routes.use("/post", require("./postRoute"));
routes.use("/message", require("./messageRoute"));
routes.use("/comment", require("./commentRoute"));
routes.use("/friend-request", require("./friendRequestRoute"));
routes.use("/conversation", require("./conversationRoute"));
routes.use("/notification", require("./notificationRoute"));
routes.use("/room-chat", require("./roomCallRoute"));

module.exports = routes;
