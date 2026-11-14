const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

exports.protect = async (req, res, next) => {
  let token;

  // Kiểm tra xem có token trong header Authorization không
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Lấy token (bỏ chữ "Bearer ")
      token = req.headers.authorization.split(' ')[1];

      // Giải mã token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // 🌟 SỬA TẠI ĐÂY: Tìm trong User trước
      let account = await User.findById(decoded.id).select('-password');

      // 🌟 Nếu không tìm thấy trong User, tìm tiếp trong Admin
      if (!account) {
        account = await Admin.findById(decoded.id).select('-password');
      }

      // Nếu không tìm thấy ở cả 2 bảng (token giả hoặc user đã bị xóa)
      if (!account) {
        return res.status(401).json({ message: 'Không tìm thấy tài khoản tương ứng với token' });
      }

      // Gắn thông tin vào req.user để các Controller phía sau sử dụng
      req.user = account;
      return next(); 
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Không có quyền truy cập, token không hợp lệ' });
    }
  }

  // Nếu không có token
  if (!token) {
    return res.status(401).json({ message: 'Không có quyền truy cập, không tìm thấy token' });
  }
};