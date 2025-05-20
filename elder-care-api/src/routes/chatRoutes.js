import express from 'express';
import auth from '../middlewares/auth.js'
import authorizeRoles from '../middlewares/authorizeRoles.js'
import chatController from '../controllers/chatController.js';

const router = express.Router();

// Lấy danh sách cuộc trò chuyện của người dùng hiện tại
router.get(
    "/my-chats", 
    auth,
    chatController.getMyChats
) 

// Lấy chi tiết một cuộc trò chuyện
router.get(
    "/:chatId",
    auth,
    chatController.getChatDetail
)

// Lấy tin nhắn của một cuộc trò chuyện
router.get(
    "/:chatId/messages",
    auth,
    chatController.getMessage
)

// Tạo cuộc trò chuyện mới
router.post(
    "/",
    auth,
    chatController.createNewChat
)

// Gửi tin nhắn mới
router.post(
    "/:chatId/messages",
    auth,
    chatController.sendNewMessage
)

// Đánh dấu tin nhắn đã đọc
router.put(
    "/:chatId/read",
    auth,
    chatController.isReadMessage
)

// Vô hiệu hóa cuộc trò chuyện (chỉ dành cho admin)
router.put(
    "/:chatId/deactivate",
    auth,
    authorizeRoles("admin"),
    chatController.deactivateMessage
)

router.get(
    "/available-users/:role",
    auth,
    chatController.getUserCanChat
)

export default router; 