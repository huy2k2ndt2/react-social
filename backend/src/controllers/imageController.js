require("dotenv").config();
// const cloudinary = require("cloudinary").v2;
// const cloudinary = require('cloudinary/lib-es5/cloudinary');
cloudinary = require("cloudinary-core").Cloudinary.new();

const imageController = {
  upload: async (req, res ,next) => {
    try {
    } catch (err) {
      next(err);
    }
  },

  deleteImage: async (req, res ,next) => {
    try {
      const { public_id } = req.body;

      cloudinary.uploader.destroy(public_id, function (error, result) {
        res.status(200).send({ result, error });
      });
    } catch (err) {
      next(err);
    }
  },

  deleteListImage: async (req, res, next) => {
    try {
    } catch (err) {
      next(err);
    }
  },
};

module.exports = imageController;
