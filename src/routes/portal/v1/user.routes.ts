import { Router } from "express";
import { UserController } from "../../../controllers/user.controller.js";

const router = Router();

// GET /portal/v1/api/user
router.get("/user", UserController.show);

export default router;

