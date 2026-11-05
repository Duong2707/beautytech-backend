const express = require('express');
const router = express.Router();
const { getDiary, addDiary, deleteDiary, clearDiary } = require('../controllers/skinDiaryController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // 👈 Bắt buộc đăng nhập

router.get('/', getDiary);
router.post('/', addDiary);
router.delete('/clear', clearDiary);
router.delete('/:id', deleteDiary);

module.exports = router;