const express = require('express');
const router = express.Router();
const { submitRating, getBookRatings, getUserRating } = require('../controllers/ratingController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/book/:bookId', getBookRatings);
router.get('/user/:bookId', authMiddleware, getUserRating);
router.post('/', authMiddleware, submitRating);

module.exports = router;
