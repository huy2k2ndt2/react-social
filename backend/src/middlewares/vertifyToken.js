const jwt = require("jsonwebtoken");
require("dotenv").config();

const vertifyToken = (req, res, next) => {
  try {
    const authorization = req.header("Authorization");

    const accessToken = authorization.split(" ")[1];

    if (!accessToken) {
      throw new Error("Access token missing");
    }

    const decode = jwt.decode(accessToken, process.env.ACCESS_TOKEN);

    if (!decode) {
      throw new Error("Access token invalid");
    }

    req.userId = decode.userId;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { vertifyToken };
