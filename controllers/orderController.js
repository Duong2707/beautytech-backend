const Order = require('../models/Order');
const Notification = require('../models/Notification');

// 1. Tạo đơn hàng mới
exports.createOrder = async (req, res) => {
  try {
    const orderData = req.body;
    const userId = req.user._id; 
    const newOrder = new Order({ ...orderData, userId });
    await newOrder.save();
    res.status(201).json({ success: true, data: newOrder });
  } catch (error) {
    console.error("Lỗi tạo đơn hàng:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// 2. Lấy danh sách đơn hàng (Đã sửa cho Admin)
exports.getUserOrders = async (req, res) => {
  try {
    let orders;
    
    // 🌟 Nếu là Admin thì lấy TẤT CẢ đơn hàng
    if (req.user.role === 'admin') {
      orders = await Order.find({}).sort({ createdAt: -1 });
    } else {
      // 🌟 Nếu là Khách hàng thì chỉ lấy đơn của chính họ
      const userId = req.user._id; 
      orders = await Order.find({ userId }).sort({ createdAt: -1 });
    }
    
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("Lỗi lấy danh sách đơn hàng:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// 3. Hủy đơn hàng (Đã sửa để Admin cũng hủy được)
exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    // Tạo query tìm kiếm cơ bản
    let query = { orderId };

    // Nếu không phải Admin, chỉ được phép tìm đơn của chính mình
    if (req.user.role !== 'admin') {
      query.userId = req.user._id;
    }

    const order = await Order.findOne(query);
    if (!order) {
      return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });
    }

    if (order.orderStatus !== 'pending' && order.orderStatus !== 'confirmed') {
      return res.status(400).json({ success: false, message: "Không thể hủy đơn hàng ở trạng thái này" });
    }

    order.orderStatus = 'cancelled';
    await order.save();

    res.json({ success: true, data: order });
  } catch (error) {
    console.error("Lỗi hủy đơn:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// 4. Cập nhật trạng thái (Giả lập - Admin dùng cái này)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body; 
    const updatedOrder = await Order.findOneAndUpdate({ orderId }, { orderStatus: status }, { new: true });
    if (!updatedOrder) return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });

    // 🌟 TỰ ĐỘNG TẠO THÔNG BÁO CHO KHÁCH HÀNG
    let title = '';
    let content = '';
    if (status === 'confirmed') {
      title = 'Đơn hàng đã được xác nhận';
      content = `Đơn hàng #${orderId} của bạn đã được người bán xác nhận.`;
    } else if (status === 'shipping') {
      title = 'Đơn hàng đang giao';
      content = `Đơn hàng #${orderId} đã được giao cho shipper và đang trên đường tới bạn.`;
    } else if (status === 'cancelled') {
      title = 'Đơn hàng bị hủy';
      content = `Rất tiếc, đơn hàng #${orderId} của bạn đã bị hủy.`;
    }

    if (title && content && updatedOrder.userId) {
      await Notification.create({
        title, content, type: 'order', userId: updatedOrder.userId
      });
    }

    res.json({ success: true, data: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// 5. Lưu đánh giá
exports.submitReview = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { rating, comment } = req.body;
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId }, 
      { orderStatus: 'reviewed', rating, comment }, 
      { new: true }
    );
    if (!updatedOrder) return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });
    res.json({ success: true, data: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};