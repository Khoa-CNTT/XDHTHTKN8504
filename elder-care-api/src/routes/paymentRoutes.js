import express from 'express';
import paymentController from '../controllers/paymentController.js';

const router = express.Router();

router.post('/create', paymentController.createPayment);
router.post('/callback', paymentController.paymentCallback);

export default router;