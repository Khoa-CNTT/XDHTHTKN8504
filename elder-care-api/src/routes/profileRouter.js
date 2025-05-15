import profileController from '../controllers/profileController.js';
import express from 'express';
import auth from '../middlewares/auth.js';
import authorizeRoles from '../middlewares/authorizeRoles.js';

const router = express.Router();

router.post('/create', auth, profileController.createProfile);

router.get(
    '/get-profiles',
    auth,
    authorizeRoles("admin", "family_member"),
    profileController.getUserProfiles
)

router.put(
    '/update/:profileId',
    profileController.updateProfile
)

router.delete(
    '/delete/:profileId',
    profileController.deleteProfile
)

export default router;