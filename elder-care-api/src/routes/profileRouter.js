import profileController from '../controllers/profileController.js';
import express from 'express';

const router = express.Router();

router.post('/create', profileController.createProfile);

export default router;