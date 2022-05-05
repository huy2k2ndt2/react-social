const cloudinary = require("cloudinary/lib-es5/cloudinary");
require("dotenv").config();

cloudinary.config({
  cloud_name: "ko-c",
  api_key: "859769854664576",
  api_secret: "4IajgOMmiGtm4j3D-kz7AhqyiCw",
});

export default cloudinary;
