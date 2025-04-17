import express from 'express';
import salaryController from '../controllers/salaryController.js';

const router = express.Router();

router.get('/monthly-salary', salaryController.getMonthSalary); 

export default router;