const Notification = require('../models/Notification');

// ================= DÀNH CHO KHÁCH HÀNG =================

// Lấy thông báo (Chung + Riêng của User đang đăng nhập)
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const notifications = await Notification.find({
      $or: [
        { userId: userId }, // Thông báo riêng của mình
        { userId: null }    // Thông báo chung
      ]
    }).sort({ createdAt: -1 }).lean();

    // Tính toán xem user này đã đọc chưa
    const formatted = notifications.map(n => ({
      ...n,
      isRead: n.userId ? true : n.readBy?.some(id => id.toString() === userId.toString()) // Nếu là riêng thì auto đọc
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Đánh dấu đã đọc
exports.markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { 
      $addToSet: { readBy: req.user._id } // Thêm user vào mảng readBy
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ================= DÀNH CHO ADMIN =================

// Lấy danh sách thông báo chung (Admin quản lý)
exports.getAdminNotifications = async (req, res) => {
  try {
    // Chỉ lấy thông báo chung (userId: null) để Admin quản lý
    const notifications = await Notification.find({ userId: null }).sort({ createdAt: -1 });
    res.json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Tạo thông báo mới
exports.createNotification = async (req, res) => {
  try {
    const { title, content, type, voucherCode } = req.body;
    const newNotif = new Notification({ 
      title, 
      content, 
      type: type || 'system', 
      voucherCode, 
      userId: null // Admin tạo thì luôn là gửi chung
    });
    await newNotif.save();
    res.status(201).json({ success: true, data: newNotif });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Xóa thông báo
exports.deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};