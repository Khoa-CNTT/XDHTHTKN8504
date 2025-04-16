import express from 'express';
import nurseController from '../controllers/nurseController.js';

const router = express.Router();

router.post('/create', nurseController.createNurse);

export default router;