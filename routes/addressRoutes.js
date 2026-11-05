// beautytech-backend/routes/addressRoutes.js
const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const { protect } = require('../middleware/authMiddleware');

// 👇 Bắt buộc đăng nhập đối với tất cả các API địa chỉ
router.use(protect); 

router.get('/', addressController.getAddresses);
router.post('/', addressController.addAddress);
router.put('/:id', addressController.updateAddress);
router.delete('/:id', addressController.deleteAddress);

module.exports = router;