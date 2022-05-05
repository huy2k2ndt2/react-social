const cloudinary = require("cloudinary/lib-es5/cloudinary");

cloudinary.config({
  cloud_name: "ko-c",
  api_key: "859769854664576",
  api_secret: "4IajgOMmiGtm4j3D-kz7AhqyiCw",
});

const removeImage = (images) => {
  try {
    images.map((image) =>
      cloudinary.uploader.destroy(image, (data, error) => {
        if (error) {
          throw error;
        }
      })
    );
  } catch (err) {
    throw err;
  }
};

module.exports = {
  removeImage,
};
