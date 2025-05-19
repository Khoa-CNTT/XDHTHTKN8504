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

router.patch(
  "/update-schedule/:scheduleId",
  auth,
  authorizeRoles("doctor", "nurse", "family_member"),
  scheduleController.updateScheduleStatus
);

router.get('/get-schedule-by-profileId/:profileId', scheduleController.getInfoSchedule)
router.get(
  "/getTodaySchedulesByUser",
  auth,
  scheduleController.getTodaySchedulesByUser
);

router.delete('/delete', scheduleController.deleteAllSchedules)

router.get("/next/staff",auth, scheduleController.getNextScheduleForStaff);
router.get("/next/user",auth, scheduleController.getNextScheduleForUser);

router.get(
  '/get-schedule-staff/:_id',
  scheduleController.getAllSchedulesByStaffId2
)

export default router;