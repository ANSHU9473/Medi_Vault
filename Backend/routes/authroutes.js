const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');
const User = require('../models/User');

const authController = require('../controllers/auth');

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

router.get("/profile", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({
            message: "Protected route working",
            user: user
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.put("/profile", protect, authController.updateProfile);

module.exports = router;
