const express = require('express');
const router = express.Router();
const multer = require('multer');
const memeController = require('../controllers/memeController');

const upload = multer({ storage: multer.memoryStorage() }).fields([
  { name: 'image', maxCount: 1 },
  { name: 'watermarkImage', maxCount: 1 }
]);

router.post('/meme/preview', upload, memeController.preview);
router.post('/meme/generate', upload, memeController.generate);

module.exports = router;