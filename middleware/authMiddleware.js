const jwt = require('jsonwebtoken');

// Middleware kiểm tra JWT token
const protect = (req, res, next) => {
  let token;

  // Lấy token từ header Authorization: Bearer <token>
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Gán userId vào request để dùng ở controller
      req.userId = decoded.id;

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ hoặc đã hết hạn',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Không có token, vui lòng đăng nhập',
    });
  }
};

module.exports = { protect };