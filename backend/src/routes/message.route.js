import express from 'express';
import { deleteMessage, getAllUser, getMessage, sendMessage } from '../controllers/message.controller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to get all users
router.get('/users',protect,getAllUser);
router.get('/:id',protect,getMessage);
router.post('/send/:id',protect,sendMessage);
router.delete('/delete/:id',protect,deleteMessage);

export default router;
