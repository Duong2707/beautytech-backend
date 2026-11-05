// models/Voucher.js
const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['percent', 'fixed'], required: true },
  value: { type: Number, required: true },
  minOrder: { type: Number, default: 0 },
  quantity: { type: Number, required: true },
  used: { type: Number, default: 0 },
  expiry: { type: String, required: true }, // Lưu dạng YYYY-MM-DD
  active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Voucher', voucherSchema);