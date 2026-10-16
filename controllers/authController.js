const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OtpToken = require('../models/OtpToken');
const { sendOtpEmail } = require('../services/emailService');
const admin = require('../config/firebaseAdmin');
const axios = require('axios');

// Tạo JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// @desc    Đăng ký người dùng mới
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { email, password, fullName, phone } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập email và password',
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được sử dụng',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      password: hashedPassword,
      fullName: fullName || '',
      phone: phone || '',
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      data: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        token,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message,
    });
  }
};

// @desc    Đăng nhập
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập email và password',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc password không đúng',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc password không đúng',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message,
    });
  }
};

// @desc    Lấy thông tin user hiện tại
// @route   GET /api/auth/me
// @access  Private (cần token)
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy user',
      });
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message,
    });
  }
};

// @desc    Gửi OTP quên mật khẩu
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập email',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Email không tồn tại trong hệ thống',
      });
    }

    await OtpToken.deleteMany({ email });

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await OtpToken.create({ email, otp, expiresAt });
    await sendOtpEmail(email, otp);

    res.status(200).json({
      success: true,
      message: 'Mã OTP đã được gửi đến email của bạn',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message,
    });
  }
};

// @desc    Xác thực OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu email hoặc OTP',
      });
    }

    const token = await OtpToken.findOne({ email, otp, used: false });

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'OTP không đúng hoặc đã hết hạn',
      });
    }

    if (token.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'OTP đã hết hạn',
      });
    }

    token.used = true;
    await token.save();

    res.status(200).json({
      success: true,
      message: 'OTP hợp lệ',
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message,
    });
  }
};

// @desc    Đặt lại mật khẩu
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu email hoặc password mới',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password phải có ít nhất 6 ký tự',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User không tồn tại',
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    await OtpToken.deleteMany({ email });

    res.status(200).json({
      success: true,
      message: 'Đặt lại mật khẩu thành công',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message,
    });
  }
};

// @desc    Đăng nhập bằng Google qua Firebase
// @route   POST /api/auth/firebase-login
// @access  Public
const firebaseLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu idToken',
      });
    }

    // Xác thực ID Token với Firebase
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, name, picture, uid } = decodedToken;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Không lấy được email từ Firebase',
      });
    }

    // Tìm hoặc tạo user trong MongoDB
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        password: '',
        fullName: name || '',
        avatar: picture || '',
        googleId: uid,
      });
    } else {
      if (!user.avatar && picture) user.avatar = picture;
      if (!user.fullName && name) user.fullName = name;
      await user.save();
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Đăng nhập Google thành công',
      data: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        token,
      },
    });
  } catch (error) {
    console.error('Firebase login error:', error);
    res.status(401).json({
      success: false,
      message: 'Xác thực Google thất bại: ' + error.message,
    });
  }
};

// @desc    Đăng nhập bằng Facebook
// @route   POST /api/auth/facebook-login
// @access  Public
const facebookLogin = async (req, res) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu accessToken',
      });
    }

    // Bước 1: Xác thực access token thuộc app của mình
    const debugRes = await axios.get(
      'https://graph.facebook.com/debug_token',
      {
        params: {
          input_token: accessToken,
          access_token: `${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`,
        },
      }
    );

    const debugData = debugRes.data.data;

    if (
      !debugData.is_valid ||
      String(debugData.app_id) !== String(process.env.FACEBOOK_APP_ID)
    ) {
      return res.status(401).json({
        success: false,
        message: 'Access token không hợp lệ',
      });
    }

    // Bước 2: Lấy thông tin user từ Facebook
    const userRes = await axios.get('https://graph.facebook.com/me', {
      params: {
        fields: 'id,name,email,picture.type(large)',
        access_token: accessToken,
      },
    });

    const fbUser = userRes.data;

    // Facebook có thể không trả email
    const email = fbUser.email || `fb_${fbUser.id}@facebook.local`;

    // Bước 3: Tìm hoặc tạo user trong MongoDB
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        password: '',
        fullName: fbUser.name || '',
        avatar: fbUser.picture?.data?.url || '',
        facebookId: fbUser.id,
      });
    } else {
      if (!user.avatar && fbUser.picture?.data?.url) {
        user.avatar = fbUser.picture.data.url;
      }
      if (!user.fullName && fbUser.name) {
        user.fullName = fbUser.name;
      }
      if (!user.facebookId) {
        user.facebookId = fbUser.id;
      }
      await user.save();
    }

    // Bước 4: Tạo JWT
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Đăng nhập Facebook thành công',
      data: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        token,
      },
    });
  } catch (error) {
    console.error(
      'Facebook login error:',
      error.response?.data || error.message
    );
    res.status(401).json({
      success: false,
      message:
        'Xác thực Facebook thất bại: ' +
        (error.response?.data?.error?.message || error.message),
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  forgotPassword,
  verifyOtp,
  resetPassword,
  firebaseLogin,
  facebookLogin,
};