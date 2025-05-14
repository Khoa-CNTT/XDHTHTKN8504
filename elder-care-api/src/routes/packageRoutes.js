import express from 'express';
import packageController from '../controllers/packageCotroller.js';

const router = express.Router();

// Create a new package
router.post('/create', packageController.createPackage);

router.get('/get-package/:serviceId', packageController.getPackagesForService)

router.get('/get-all-package', packageController.getAllPackages)
router.delete('/delete-all', packageController.deleteAllPackages);

export default router;