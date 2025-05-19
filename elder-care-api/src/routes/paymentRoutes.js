import express from 'express';
import paymentController from '../controllers/paymentController.js';

const router = express.Router();

router.post('/create', paymentController.createPayment);
router.post('/callback', paymentController.paymentCallback);
router.get('/get-payments/:_id', paymentController.getPaymentByStaff)
router.get('/get-salary/:_id', paymentController.calculateSalary)
router.get('/get-all', paymentController.getAllPayment)
router.get('/count-payments', paymentController.countPayments)

router.get(
    '/count-revenue',
    paymentController.getMonthlyRevenue
)

router.get(
    '/get-total-month-revenue',
    paymentController.getTotalMonthlyRevenue
)

export default router;