// controllers/voucherController.js
const Voucher = require('../models/Voucher');
const Notification = require('../models/Notification');

// 1. Lấy danh sách (Khách hàng chỉ lấy mã active, Admin lấy hết)
exports.getVouchers = async (req, res) => {
  try {
    let query = {};
    // Nếu không phải Admin, chỉ trả về voucher đang hoạt động
    if (req.user?.role !== 'admin') {
      query = { active: true };
    }
    const vouchers = await Voucher.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: vouchers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// 2. Tạo voucher mới (Admin)
exports.createVoucher = async (req, res) => {
  try {
    const newVoucher = new Voucher(req.body);
    await newVoucher.save();

    // 🌟 TỰ ĐỘNG TẠO THÔNG BÁO CHUNG
    await Notification.create({
      title: 'Mã giảm giá mới!',
      content: `Sử dụng mã ${newVoucher.code} để nhận ưu đãi. Nhanh tay lên nhé!`,
      type: 'promo',
      voucherCode: newVoucher.code,
      userId: null
    });

    res.status(201).json({ success: true, data: newVoucher });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Mã voucher đã tồn tại' });
    }
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// 3. Cập nhật voucher (Admin)
exports.updateVoucher = async (req, res) => {
  try {
    const updatedVoucher = await Voucher.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedVoucher) return res.status(404).json({ success: false, message: 'Không tìm thấy voucher' });
    res.json({ success: true, data: updatedVoucher });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// 4. Xóa voucher (Admin)
exports.deleteVoucher = async (req, res) => {
  try {
    await Voucher.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Đã xóa voucher' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};