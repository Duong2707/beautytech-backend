// beautytech-backend/models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  // Thêm 'order' vào enum để phân biệt thông báo đơn hàng
  type: { type: String, enum: ['promo', 'system', 'order'], default: 'system' }, 
  voucherCode: { type: String }, 
  
  // Nếu có userId -> Thông báo riêng (VD: Đơn hàng). Nếu null -> Thông báo chung
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  
  // Mảng lưu ID những người dùng đã đọc thông báo chung
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);