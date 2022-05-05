const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const refreshTokenList = [];

const generateToken = (id) => {
  const accessToken = jwt.sign(
    {
      userId: id,
    },
    process.env.ACCESS_TOKEN_KEY,
    {
      expiresIn: "1h",
    }
  );

  const refreshToken = jwt.sign(
    {
      userId: id,
    },
    process.env.REFRESH_TOKEN_KEY,
    {
      expiresIn: "2h",
    }
  );

  refreshTokenList.push(refreshToken);

  return {
    accessToken,
    refreshToken,
  };
};

const authController = {
  register: async (req, res, next) => {
    try {
      const { userName, password, email, keys } = req.body;

      const salt = bcrypt.genSaltSync(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        userName,
        password: hashPassword,
        email,
        keys,
      });

      await newUser.save();

      res.json({
        message: "Create User Success",
        user: newUser,
      });
    } catch (err) {
      next(err);
    }
  },

  login: async (req, res, next) => {
    try {
      const { userName, password } = req.body;

      if (!userName || !password) {
        throw new Error("Invalid userName or password");
      }

      const userLogin = await User.findOne({
        userName,
      });

      if (!userLogin) {
        throw new Error("Invalid user name or password");
      }

      const matchPassword = await bcrypt.compare(password, userLogin.password);

      if (!matchPassword) {
        throw new Error("Invalid password");
      }

      const { accessToken, refreshToken } = generateToken(userLogin._id);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        path: "/v1/auth/refresh-token",
        maxAge: 60 * 60,
      });

      const { password: passwordUserLogin, ...userInfo } = userLogin._doc;

      res.json({
        message: "Login Success",
        user: userInfo,
        accessToken,
        refreshToken,
      });
    } catch (err) {
      next(err);
    }
  },

  logout: async (req, res, next) => {
    try {
      res.clearCookie("refreshToken");

      refreshTokenList.filter((el) => el !== refreshToken);

      res.json({
        message: "Logout Success",
      });
    } catch (err) {
      next(err);
    }
  },

  handleRefreshToken: async (req, res, next) => {
    try {
      // const refreshToken = req.cookies.refreshToken;

      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new Error("Invalid refresh token");
      }

      const { userId } = jwt.decode(
        refreshToken,
        process.env.REFRESH_TOKEN_KEY
      );

      // || !refreshTokenList.includes(refreshToken)
      if (!userId) {
        throw new Error("Invalid refresh token");
      }

      // refreshTokenList.filter((el) => el !== refreshToken);

      const { accessToken, refreshToken: newRefreshToken } =
        generateToken(userId);

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        path: "/v1/auth/refresh-token",
        maxAge: 60 * 60,
      });

      res.json({
        message: "Refresh token Success",
        newAccessToken: accessToken,
        newRefreshToken,
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = authController;
