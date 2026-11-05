const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Bắt buộc đăng nhập mới được xóa
router.delete('/profile', protect, userController.deleteUserProfile);

module.exports = router;