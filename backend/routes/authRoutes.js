import express from 'express';
import {
  register,
  login,
  verifyEmail,
  getUsers,
  blockUsers,
  unblockUsers,
  deleteUsers,
  deleteUnverifiedUsers
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);

// Protected routes
router.get('/users', protect, getUsers);
router.post('/users/block', protect, blockUsers);
router.post('/users/unblock', protect, unblockUsers);
router.post('/users/delete', protect, deleteUsers);
router.delete('/users/unverified', protect, deleteUnverifiedUsers);

export default router;