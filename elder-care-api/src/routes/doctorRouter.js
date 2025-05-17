import express from 'express';
import docterController from '../controllers/doctorController.js';
import auth from '../middlewares/auth.js'
import authorizeRoles from '../middlewares/authorizeRoles.js';

const router = express.Router();

router.post('/create', docterController.createDoctor);

router.get(
    '/get-doctors',
    auth,
    authorizeRoles('admin'),
    docterController.getAllDoctor
)

router.put(
    '/update/:_id',
    docterController.updateDoctor
)

export default router