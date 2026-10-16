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
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Auth cơ bản
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// Quên mật khẩu
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

// Social login
router.post('/firebase-login', firebaseLogin);
router.post('/facebook-login', facebookLogin);

module.exports = router;