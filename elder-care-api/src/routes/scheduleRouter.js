import scheduleController from "../controllers/scheduleController.js";
import express from "express";

const router = express.Router();

router.get(
  "/:_id/patient-profile",
  scheduleController.getScheduleByBookingId
);

export default router;