const express = require('express');
const router = express.Router();
const { getCommentsByBookId, addComment, updateComment, deleteComment } = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:bookId', getCommentsByBookId);
router.post('/', authMiddleware, addComment);
router.put('/:id', authMiddleware, updateComment);
router.delete('/:id', authMiddleware, deleteComment);

module.exports = router;
