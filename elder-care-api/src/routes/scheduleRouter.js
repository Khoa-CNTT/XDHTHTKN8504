import scheduleController from "../controllers/scheduleController.js";
import express from "express";

const router = express.Router();

router.get(
  "/:_id/patient-profile",
  scheduleController.getScheduleByBookingId
);

router.get(
  "/:staffId/completed-jobs",
  scheduleController.getComplatedInMonth
);

export default router;