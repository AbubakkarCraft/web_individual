const express = require('express');
const router = express.Router();
const { updateProgress, getProgress, getAllProgress } = require('../controllers/progressController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getAllProgress);
router.get('/:bookId', authMiddleware, getProgress);
router.post('/', authMiddleware, updateProgress);

module.exports = router;
