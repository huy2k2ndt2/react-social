const express = require("express");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const createError = require("http-errors");
const { connectMongoose } = require("./connect");
const { configUploadFile } = require("./config");
const { PeerServer } = require("peer");

require("dotenv").config();

connectMongoose()
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

//config
configUploadFile(app);

//config peer severr
const peerServer = PeerServer({ port: 9000, path: "/" });

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use(require("./routes"));

app.use((req, res, next) => {
  next(createError.NotFound("This Router Not found"));
});

app.use((err, req, res, next) => {
  console.log("err", err);
  res.status(500).json({
    status: err.status || 500,
    message: err.message,
  });
});

module.exports = app;
