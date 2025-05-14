import express from 'express';
import packageController from '../controllers/packageCotroller.js';

const router = express.Router();

// Create a new package
router.post('/create', packageController.createPackage);

export default router;