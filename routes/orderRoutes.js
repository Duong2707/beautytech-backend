const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', orderController.createOrder);
router.get('/', orderController.getUserOrders);
router.put('/:orderId/cancel', orderController.cancelOrder); // Route hủy đơn
router.put('/:orderId/status', orderController.updateOrderStatus);
router.put('/:orderId/review', orderController.submitReview);

module.exports = router;