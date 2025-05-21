import express from "express";
import invoiceController from "../controllers/invoiceController.js";

const router = express.Router();

router.get(
    '/',
    invoiceController.getInvoice
)

export default router;