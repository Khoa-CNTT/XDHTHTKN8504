import express from "express";
import serviceController from "../controllers/serviceController.js";

const router = express.Router();

router.post("/create", serviceController.createService);

export default router;