import { Router } from "express";
import { InvoiceController } from "../../../controllers/invoice.controller.js";

const router = Router();

// POST /portal/v1/api/invoice/issued
router.post("/invoice/issued", InvoiceController.issued);

export default router;

