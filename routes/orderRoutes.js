const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware'); 
// const { protect, admin } = require('../middleware/authMiddleware'); // Bỏ comment nếu có middleware admin

router.use(protect);

router.post('/', orderController.createOrder);
router.get('/', orderController.getUserOrders);
router.put('/:orderId/cancel', orderController.cancelOrder); // Route khách yêu cầu hủy
router.put('/:orderId/status', orderController.updateOrderStatus);
router.put('/:orderId/review', orderController.submitReview);

// 🌟 THÊM DÒNG NÀY: Route Admin xác nhận đã hoàn tiền
router.put('/:orderId/refund', orderController.confirmRefund); 

module.exports = router;