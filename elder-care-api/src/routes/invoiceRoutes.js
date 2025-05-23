import express from "express";
import invoiceController from "../controllers/invoiceController.js";

const router = express.Router();

router.get(
    '/',
    invoiceController.getInvoice
)

router.get(
    '/get-detail/:id',
    invoiceController.getInvoiceDetail
)

router.get(
    '/get-invoice-for-staff/:_id',
    invoiceController.getInvoiceForStaff
)

export default router;