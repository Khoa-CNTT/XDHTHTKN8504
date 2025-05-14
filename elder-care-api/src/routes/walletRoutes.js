import express from 'express';
import walletController from '../controllers/WalletController.js';
import auth from '../middlewares/auth.js';
import authorizeRoles from "../middlewares/authorizeRoles.js";

const router = express.Router();

router.post(
    '/topup',
    auth,
    authorizeRoles("family_member"),
    walletController.topUpWallet
);

router.post(
    '/callback',
    walletController.walletCallback
);

export default router