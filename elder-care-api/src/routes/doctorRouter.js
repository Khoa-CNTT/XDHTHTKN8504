import express from 'express';
import docterController from '../controllers/doctorController.js';

const router = express.Router();

router.post('/create', docterController.createDoctor);

export default router