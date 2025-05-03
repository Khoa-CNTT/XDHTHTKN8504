import expess from 'express';
import bookingController from '../controllers/bookingController.js';
import authorizeRoles from '../middlewares/authorizeRoles.js';
import auth from '../middlewares/auth.js';

const router = expess.Router();

/**
 * @swagger
 * /api/v1/bookings/create:
 *   post:
 *     description: Tạo một booking mới cho thành viên gia đình
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientId:
 *                 type: string
 *               doctorId:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               time:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo booking thành công
 *       400:
 *         description: Thông tin không hợp lệ
 *       401:
 *         description: Người dùng chưa xác thực
 *       403:
 *         description: Người dùng không có quyền
 */
router.post(
    '/create',
    auth,
    authorizeRoles("admin", "family_member"),
    bookingController.createBooking
);

/**
 * @swagger
 * /api/v1/bookings/accept/{bookingId}:
 *   patch:
 *     description: Chấp nhận booking bởi bác sĩ hoặc điều dưỡng
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         description: ID của booking cần chấp nhận
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chấp nhận booking thành công
 *       400:
 *         description: ID booking không hợp lệ
 *       401:
 *         description: Người dùng chưa xác thực
 *       403:
 *         description: Người dùng không có quyền
 *       404:
 *         description: Booking không tìm thấy
 */
router.patch(
    "/accept/:bookingId",
    auth,
    authorizeRoles("doctor", "nurse"),
    bookingController.acceptBooking
);

router.get(
    '/get-booking/:bookingId',
    auth,
    authorizeRoles("doctor", "nurse"),
    bookingController.getBookingById
)

router.get(
    '/get-bookings-completed',
    auth,
    authorizeRoles("doctor", "nurse"),
    bookingController.getCompletedBookings
)

router.get(
    '/get-bookings-for-staff',
    auth,
    authorizeRoles("doctor", "nurse", "admin"),
    bookingController.getBookingForStaff
)

// Lấy booking cho khách hàng 
router.get(
    '/get-bookings-for-customer',
    auth,
    authorizeRoles("family_member"),
    bookingController.getBookingForCustomer
)

router.delete(
    '/delete',
    bookingController.deleteAllBookings
)

export default router