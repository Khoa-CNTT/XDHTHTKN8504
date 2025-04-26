import express from 'express';
import chatController from '../controllers/chatController.js';

const router = express.Router();

router.post("/send-message", chatController.sendMessage);
router.get("/get-message", chatController.getMessages);
router.get("/conversations/:userId", chatController.getRecentConversations);

export default router; 