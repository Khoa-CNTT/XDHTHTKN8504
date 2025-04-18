import scheduleController from "../controllers/scheduleController.js";
import express from "express";
import authorizeRoles from '../middlewares/authorizeRoles.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.get(
  "/:_id/patient-profile",
  scheduleController.getScheduleByBookingId
);

router.get(
  "/:staffId/completed-jobs",
  scheduleController.getComplatedInMonth
);

router.get(
  "/get-schedules",
  auth,
  authorizeRoles("doctor", "nurse"),
  scheduleController.getAllSchedulesByStaffId
);

export default router;