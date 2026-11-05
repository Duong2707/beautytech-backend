// routes/voucherRoutes.js
const express = require('express');
const router = express.Router();
const { getVouchers, createVoucher, updateVoucher, deleteVoucher } = require('../controllers/voucherController');
const { protect } = require('../middleware/authMiddleware'); // Đường dẫn tới file protect của bạn

router.route('/')
  .get(protect, getVouchers) // Ai cũng lấy được (nhưng logic trong controller sẽ tự lọc)
  .post(protect, createVoucher);

router.route('/:id')
  .put(protect, updateVoucher)
  .delete(protect, deleteVoucher);

module.exports = router;