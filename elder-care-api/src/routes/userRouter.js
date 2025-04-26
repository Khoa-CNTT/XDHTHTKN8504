import userController from "../controllers/userController.js"; 

import express from "express";
import authorizeRoles from "../middlewares/authorizeRoles.js";
import auth from "../middlewares/auth.js";

const router = express.Router();
/**
 * @swagger
 * /api/v1/user/availability:
 *   patch:
 *     summary: Cập nhật trạng thái sẵn sàng của bác sĩ hoặc điều dưỡng
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isAvailable:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Trạng thái đã được cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Nurse'
 *       401:
 *         description: Không được phép (chưa đăng nhập hoặc không đúng vai trò)
 *       500:
 *         description: Lỗi server
 */
router.patch(
  "/availability",
  auth,
  authorizeRoles("doctor", "nurse"),
  userController.updateAvailabilityStatus 
);

export default router;
