const express = require('express');
const router = express.Router();
const { getNotesByBookId, addNote, deleteNote } = require('../controllers/noteController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:bookId', authMiddleware, getNotesByBookId);
router.post('/', authMiddleware, addNote);
router.delete('/:id', authMiddleware, deleteNote);

module.exports = router;
