import scheduleController from "../controllers/scheduleController.js";
import express from "express";
import authorizeRoles from '../middlewares/authorizeRoles.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.get(
  "/completed-jobs",
  auth,
  authorizeRoles("doctor", "nurse"),
  scheduleController.getComplatedInMonth
);

router.get(
  "/get-schedules",
  auth,
  authorizeRoles("doctor", "nurse"),
  scheduleController.getAllSchedulesByStaffId
);

router.put(
  "/update-schedule/:scheduleId",
  auth,
  authorizeRoles("doctor", "nurse", "family_member"),
  scheduleController.updateScheduleStatus
);

router.get('/get-schedule-by-profileId/:profileId', scheduleController.getInfoSchedule)

export default router;