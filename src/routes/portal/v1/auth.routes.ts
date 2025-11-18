import { Router } from "express";
import { AuthController } from "../../../controllers/auth.controller.js";

const router = Router();

// POST /portal/v1/api/auth/login
router.post("/auth/login", AuthController.login);

// POST /portal/v1/api/auth/register
router.post("/auth/register", AuthController.register);

export default router;

