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

router.get(
    '/count-bookings', bookingController.countBookingsPerMonthLast12Months
)

router.get(
    '/get-all-bookings',
    bookingController.getAllBookings
)

router.patch(
    '/canceled/:bookingId',
    auth,
    authorizeRoles("admin", "family_member"),
    bookingController.canceledBooking
)

router.get(
    '/get-profiles',
    auth,
    authorizeRoles("admin"),
    bookingController.getCompletedPatients
)

// delete booking by Admin
router.delete(
    '/delete-booking/:bookingId',
    auth,
    authorizeRoles('admin'),
    bookingController.deleteBookingById
)

router.post(
    '/create-booking-package',
    auth,
    authorizeRoles('admin', 'family_member'),
    bookingController.createBookingByPackage
)

router.get(
    '/get-booking-customer/:userId',
    bookingController.getBookingForCustomer2
)
router.post(
  "/cancel-booking-for-user/:bookingId",
  bookingController.cancelBookingForUser
);

router.get(
    '/get-booking-detail/:bookingId',
    bookingController.getBookingDetail
);
router.get('/get-bookings-for-participant', auth, bookingController.getBookingForParticipant);

export default router