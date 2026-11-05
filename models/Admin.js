// models/Admin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, default: 'Quản trị viên' },
  role: { type: String, default: 'admin' }
}, { timestamps: true });

// Mã hóa mật khẩu trước khi lưu
adminSchema.pre('save', async function () {
  // Nếu mật khẩu không bị thay đổi thì bỏ qua
  if (!this.isModified('password')) {
    return;
  }
  
  // Hash mật khẩu
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('Admin', adminSchema);