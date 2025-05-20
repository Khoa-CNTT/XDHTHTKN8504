import express from 'express'
import auth from "../middlewares/auth.js";
import authorizeRoles from "../middlewares/authorizeRoles.js";
import reviewController from '../controllers/reviewController.js';

const router = express.Router();

router.post(
    '/:scheduleId',
    auth,
    authorizeRoles('family_member'),
    reviewController.createReview
)

router.get(
    '/:staffId',
    reviewController.getReview
)

export default router;