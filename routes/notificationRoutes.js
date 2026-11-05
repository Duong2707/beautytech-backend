const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

// Khách hàng
router.get('/', protect, notificationController.getNotifications);
router.put('/:id/read', protect, notificationController.markAsRead);

// Admin
router.get('/admin', protect, notificationController.getAdminNotifications);
router.post('/', protect, notificationController.createNotification);
router.delete('/:id', protect, notificationController.deleteNotification);

module.exports = router;