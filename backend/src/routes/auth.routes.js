const express = require('express');
const router = express.Router();
const {
  login,
  register,
  getMe,
  refreshToken,
  logout,
  changePassword
} = require('../controllers/auth.controller');
const { protect, authorize } = require('../middleware/auth');
const { loginValidator, registerValidator } = require('../middleware/validators');

// Public routes
router.post('/login', loginValidator, login);
router.post('/refresh', refreshToken);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.put('/password', protect, changePassword);

// Admin only
router.post('/register', protect, authorize('admin'), registerValidator, register);

module.exports = router;
