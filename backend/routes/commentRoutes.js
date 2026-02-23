const express = require('express');
const router = express.Router();
const { getCommentsByBookId, addComment } = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:bookId', getCommentsByBookId);
router.post('/', authMiddleware, addComment);

module.exports = router;
