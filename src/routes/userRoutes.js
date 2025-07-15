const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authController.verifyToken, (req, res) => {
    res.json({ message: 'Authenticated', userId: req.userId });
});

module.exports = router;