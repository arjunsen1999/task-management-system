import express from 'express';
import { saveMessage, getMessages } from '../controllers/chat.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Save message to DB
router.post('/', verifyJWT, saveMessage);

// Get chat history between two users
router.get('/:userId', verifyJWT, getMessages);

export default router;
