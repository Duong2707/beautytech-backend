const express = require('express');
const router = express.Router();
const multer = require('multer');
const { analyze, getHistory } = require('../controllers/skinController');
const { protect } = require('../middleware/authMiddleware');

// Lưu file trong RAM
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// POST /api/skin/analyze (cần token + file ảnh)
router.post('/analyze', protect, upload.single('image'), analyze);

// GET /api/skin/history (cần token)
router.get('/history', protect, getHistory);

module.exports = router;