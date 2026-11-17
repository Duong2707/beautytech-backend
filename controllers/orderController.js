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

// 2. Lấy danh sách đơn hàng
exports.getUserOrders = async (req, res) => {
  try {
    let orders;
    if (req.user.role === 'admin') {
      orders = await Order.find({}).sort({ createdAt: -1 });
    } else {
      const userId = req.user._id; 
      orders = await Order.find({ userId }).sort({ createdAt: -1 });
    }
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("Lỗi lấy danh sách đơn hàng:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// 3. Khách hàng yêu cầu hủy đơn
exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    let query = { orderId };
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

    // 🌟 LOGIC MỚI: Phân biệt đã thanh toán hay chưa
    if (order.paymentStatus === 'paid') {
      // Đã chuyển khoản -> Chờ Admin xử lý hoàn tiền
      order.orderStatus = 'cancel_requested';
    } else {
      // COD hoặc chưa chuyển khoản -> Hủy luôn
      order.orderStatus = 'cancelled';
    }

    await order.save();
    res.json({ success: true, data: order });
  } catch (error) {
    console.error("Lỗi hủy đơn:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// 4. Cập nhật trạng thái (Admin duyệt đơn, giao hàng...)
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

// 6. 🌟 ADMIN XÁC NHẬN ĐÃ HOÀN TIỀN
exports.confirmRefund = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });
    }

    if (order.orderStatus !== 'cancel_requested') {
      return res.status(400).json({ success: false, message: "Đơn hàng không ở trạng thái yêu cầu hủy" });
    }

    // Chốt trạng thái: Đã hủy hoàn toàn và Đã hoàn tiền
    order.orderStatus = 'cancelled';
    order.paymentStatus = 'refunded';
    await order.save();

    // Gửi thông báo cho khách hàng
    if (order.userId) {
      await Notification.create({
        title: 'Hủy đơn & Hoàn tiền thành công',
        content: `Đơn hàng #${orderId} đã được hủy và hoàn tiền vào tài khoản của bạn.`,
        type: 'order',
        userId: order.userId
      });
    }

    res.json({ success: true, message: "Xác nhận hoàn tiền thành công", data: order });
  } catch (error) {
    console.error("Lỗi xác nhận hoàn tiền:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};