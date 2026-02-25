const express = require('express');
const router = express.Router();
const { getAllReviews, getReviewsByBookId, addReview, updateReview, deleteReview } = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', getAllReviews);
router.get('/book/:bookId', getReviewsByBookId);
router.post('/', authMiddleware, addReview);
router.put('/:id', authMiddleware, updateReview);
router.delete('/:id', authMiddleware, deleteReview);

module.exports = router;
