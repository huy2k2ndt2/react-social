const multer = require("multer");

const configUploadFile = (app) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images");
    },
    filename: (req, file, cb) => {
      cb(null, req.body.name || file.originalname);
    },
  });

  const upload = multer({ storage });
  app.post("/v1/api/upload", upload.single("file"), (req, res, next) => {
    try {
      return res.json({
        message: "Upload Success",
      });
    } catch (e) {
      res.status(500).json({
        message: "Upload file failed",
      });
    }
  });
};

module.exports = configUploadFile;
