const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: false, // Có thể rỗng nếu đăng nhập bằng Google/Facebook
    },
    fullName: {
      type: String,
      default: '',
      trim: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    address: {
      type: String,
      default: '',
      trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    avatar: {
      type: String,
      default: '',
    },
    googleId: {
      type: String,
    },
    facebookId: {
      type: String,
    },
    
    // 🌟 THÊM 3 TRƯỜNG THÔNG TIN NGÂN HÀNG ĐỂ HOÀN TIỀN
    bankName: {
      type: String,
      default: '',
      trim: true,
    },
    bankAccountNumber: {
      type: String,
      default: '',
      trim: true,
    },
    bankAccountName: {
      type: String,
      default: '',
      trim: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);