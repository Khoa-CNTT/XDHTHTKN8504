import express from "express";
import authController from "../controllers/authController.js";
import upload from "../middlewares/upload.js";
import auth from "../middlewares/auth.js";
import authorizeRoles from "../middlewares/authorizeRoles.js";

const router = express.Router();

router.post("/signup", authController.registerUser);
router.post("/login", authController.loginUser);
// router.patch("/forgotpassword", authController.forgotPassUser);

router.post(
  "/upload",
  auth,
  upload.single("avatar"),
  authorizeRoles("admin", "doctor", "nurse", "family-member"),
  authController.uploadAvatar
);

router.post(
  "/uploads",
  upload.single("file"),
  authController.uploadAvatarByAdmin
);

// Đếm số người dùng trong 12 tháng
router.get("/count-users-per-month", authController.countMembersPerMonth);

// Cập nhập trạng thái hoạt động của bác sĩ và điều dưỡng
router.patch(
  "/is-available",
  auth,
  authorizeRoles("doctor", "nurse"),
  authController.updateAvailabilityStatus
);

// Get Staff
router.get("/get-staff", authController.getAllStaff);

router.get("/get-customer", authController.getAllUsers);

// Change password
router.patch(
  "/change-password",
  auth,
  authorizeRoles("admin", "doctor", "nurse", "family-member"),
  authController.changePassword
)

router.patch(
  '/change-password-by-admin/:userId',
  authController.changePasswordByAdmin
)

router.delete(
  '/delete-user/:userId',
  authController.deleteOneUser
)

router.get(
  '/search-customer',
  authController.searchCustomer
)

//Xóa nhân viên
router.delete(
  '/delete-staff/:staffId',
  auth,
  authorizeRoles('admin'),
  authController.deleteStaff
)

//Tìm nhân viên qua id
router.get(
  '/get-staff-id/:_id',
  authController.getStaffById
)

//Xóa khách hàng bằng _id
router.delete(
  '/delete-customer/:customerId',
  authController.deleteCustomerByAdmin
)

//Đếm khách hàng today, month, year
router.get(
  '/count-customers',
  authController.countCustomersTodayMonthYear
)

//lấy thông tin khách hàng
router.get(
  '/get-customer-info/:customerId',
  authController.getCustomerById
)

router.get(
  '/count-staffs',
  authController.countStaffByMonth
)

router.delete(
  '/delete-all',
  authController.deleteAll
)

router.get(
  '/count-staff', 
  authController.countStaffInLast12Months
)

router.get(
  '/search-customer',
  authController.searchCustomer
)

router.get(
  '/get-staff-detail/:userId',
  authController.getStaffDetail
)


export default router;
