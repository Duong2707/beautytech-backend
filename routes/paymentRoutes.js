const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); // 👈 Import Model Order

router.post('/sepay-webhook', async (req, res) => {
  try {
    const data = req.body;
    if (data.transferType === 'in') {
      const content = data.content || ""; 
      // 👇 SỬA TẠI ĐÂY: Xóa khoảng trắng, viết hoa toàn bộ, và tìm mã đơn
      const cleanContent = content.replace(/\s+/g, '').toUpperCase(); // Xóa khoảng trắng & viết hoa
      const match = cleanContent.match(/ORD\d+/); // Tìm mã đơn

      if (match) {
          const orderId = match[0];
          console.log(`✅ SePay báo đã nhận tiền cho đơn ${orderId}`);
          // ... (Phần update giữ nguyên)
      } else {
          // 👇 Thêm log này để biết nếu ngân hàng cắt mất chữ ORD
          console.log(`⚠️ Nhận được tiền nhưng không tìm thấy mã đơn. Nội dung gốc: "${content}"`);
      }
      
      if (match) {
        const orderId = match[0];
        console.log(`✅ SePay báo đã nhận tiền cho đơn ${orderId}`);
        
        // 👇 CẬP NHẬT VÀO DATABASE
        await Order.findOneAndUpdate(
          { orderId: orderId }, 
          { paymentStatus: 'paid', orderStatus: 'confirmed' }
        );
      }
    }
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

router.get('/check-status/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (order && order.paymentStatus === 'paid') {
      res.json({ status: 'paid' });
    } else {
      res.json({ status: 'pending' });
    }
  } catch (error) {
    res.json({ status: 'pending' });
  }
});

module.exports = router;