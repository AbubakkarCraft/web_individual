const express = require('express');
const router = express.Router();
const { getWishlist, toggleWishlist } = require('../controllers/wishlistController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getWishlist);
router.post('/toggle', authMiddleware, toggleWishlist);

module.exports = router;
