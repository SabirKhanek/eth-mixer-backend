const multer = require("multer");
const { STORAGE_MOUNT } = require("../config");
const { validateToken } = require("../controllers/auth");
const { uploadImage } = require("../controllers/image");
const router = require("express").Router();
const fs = require("fs");
const path = require("path");
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = STORAGE_MOUNT + "/uploads/images/";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + Date.now() + extension);
  },
});

let upload = multer({
  storage: storage,
});

router.post("/", validateToken, upload.single("image"), uploadImage);

module.exports.imageRouter = router;
