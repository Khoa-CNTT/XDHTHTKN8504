import express from "express";
import serviceController from "../controllers/serviceController.js";

const router = express.Router();

router.post("/create", serviceController.createService);

router.get(
    '/get-services',
    serviceController.getService
)

router.put(
    '/update-service/:serviceId',
    serviceController.updateService
)

router.delete(
    '/delete-service/:serviceId',
    serviceController.deleteService
)
router.delete('/delete-all', serviceController.deleteAllServices)

export default router;