import expess from 'express';
import bookingController from '../controllers/bookingController.js';
import authorizeRoles from '../middlewares/authorizeRoles.js';
import auth from '../middlewares/auth.js';

const router = expess.Router();

router.post(
    '/create', 
    auth,
    authorizeRoles("family_member"),
    bookingController.createBooking
);

router.patch(
    "/accept/:bookingId", 
    auth, 
    authorizeRoles("doctor", "nurse"), 
    bookingController.acceptBooking
);

export default router