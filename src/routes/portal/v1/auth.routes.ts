import { Router } from "express";
import { AuthController } from "../../../controllers/auth.controller.js";

const router = Router();

// POST /portal/v1/api/auth/login
router.post("/auth/login", AuthController.login);

export default router;

