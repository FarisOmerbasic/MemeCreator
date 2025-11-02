const express = require("express");
const router = express.Router();
const multer = require("multer");
const memeController = require("../controllers/memeController");
const auth = require("../middleware/auth");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
    fieldSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpeg")
      cb(null, true);
    else cb(new Error("Only .png and .jpeg format allowed!"), false);
  },
}).fields([
  { name: "image", maxCount: 1 },
  { name: "watermarkImage", maxCount: 1 },
]);

router.post("/meme/preview", upload, memeController.preview);
router.post("/meme/generate", auth, upload, memeController.generate);

module.exports = router;
