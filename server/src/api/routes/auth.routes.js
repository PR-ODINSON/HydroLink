const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
} = require('../controllers/auth.controller');
const User = require('../models/user.model');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// Protected routes
router.get('/me', protect, getMe);

// Debug route to check all users (for testing only)
router.get('/debug/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({
      success: true,
      count: users.length,
      users: users
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching users', 
      error: error.message 
    });
  }
});

module.exports = router;