const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  forgotPassword,
  verifyOtp,
  resetPassword,
  firebaseLogin,
  facebookLogin,
  updateProfile, // Import hàm mới
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
router.post('/firebase-login', firebaseLogin);
router.post('/facebook-login', facebookLogin);

// Cập nhật hồ sơ (Thêm dòng này)
router.put('/profile', protect, updateProfile);

module.exports = router;