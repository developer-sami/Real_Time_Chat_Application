import express from 'express';
import { login, logout, signup } from '../controllers/auth.controller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', protect, logout)

export default router;