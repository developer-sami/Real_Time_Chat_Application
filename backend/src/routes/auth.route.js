import express from 'express';
import { deleteUser, login, logout, profile, signup, updateUser } from '../controllers/auth.controller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', protect, profile)
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', protect, logout)
router.put('/update', protect, updateUser);
router.post("/destroy", protect, deleteUser);

export default router;