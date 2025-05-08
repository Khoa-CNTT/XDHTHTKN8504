import express from "express";
import authController from "../controllers/authController.js";
import upload from '../middlewares/upload.js';
import auth from "../middlewares/auth.js";
import authorizeRoles from "../middlewares/authorizeRoles.js";

const router = express.Router();

router.post("/signup", authController.registerUser);
router.post("/login", authController.loginUser);

router.post(
    "/upload", 
    auth,
    upload.single("avatar"),
    authorizeRoles("admin", "doctor", "nurse", "family-member"), 
    authController.uploadAvatar
);

// Đếm số người dùng trong 12 tháng
router.get(
    "/count-users-per-month",
    authController.countMembersPerMonth
)

// Cập nhập trạng thái hoạt động của bác sĩ và điều dưỡng
router.patch(
    "/is-available",
    auth,
    authorizeRoles("doctor", "nurse"),
    authController.updateAvailabilityStatus
)

// Get Staff
router.get(
    "/get-staff",
    authController.getAllStaff
)

export default router;
