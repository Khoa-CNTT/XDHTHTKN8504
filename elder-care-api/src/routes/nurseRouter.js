import express from 'express';
import nurseController from '../controllers/nurseController.js';
import auth from '../middlewares/auth.js'
import authorizeRoles from '../middlewares/authorizeRoles.js';

const router = express.Router();

router.post('/create', nurseController.createNurse);

router.get(
    '/get-all',
    auth,
    authorizeRoles('admin'),
    nurseController.getAllNurse
)

router.put(
    '/update/:_id',
    nurseController.updateNurse
)

export default router;