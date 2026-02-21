const express = require('express');
const router = express.Router();
const { signup, signin, forgotPassword } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/forgot-password', forgotPassword);

module.exports = router;
