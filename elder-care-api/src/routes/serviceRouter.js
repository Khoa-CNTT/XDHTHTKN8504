import express from "express";
import serviceController from "../controllers/serviceController.js";

const router = express.Router();

router.post("/create", serviceController.createService);

router.get(
    '/get-services',
    serviceController.getService
)

export default router;