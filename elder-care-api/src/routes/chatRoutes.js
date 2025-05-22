import express from 'express';
import auth from '../middlewares/auth.js';
import authorizeRoles from '../middlewares/authorizeRoles.js';
import chatController from '../controllers/chatController.js';

const router = express.Router();

//  Route tĩnh phải đặt trước
router.get("/my-chats", auth, chatController.getMyChats);

router.get("/available-users/:role?", auth, chatController.getUserCanChat);

//  Route tạo mới
router.post("/", auth, chatController.createNewChat);

//  Route gửi tin nhắn
router.post("/:chatId/messages", auth, chatController.sendNewMessage);

//  Route lấy tin nhắn
router.get("/:chatId/messages", auth, chatController.getMessage);

//  Đánh dấu tin nhắn đã đọc
router.put("/:chatId/read", auth, chatController.isReadMessage);

//  Vô hiệu hóa cuộc trò chuyện
router.put("/:chatId/deactivate", auth, authorizeRoles("admin"), chatController.deactivateMessage);

//  Cuối cùng mới là lấy chi tiết chat theo `chatId`
router.get("/:chatId", auth, chatController.getChatDetail);

export default router;
