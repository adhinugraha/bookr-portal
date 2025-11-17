import { Router } from "express";
import { BookingController } from "../../../controllers/booking.controller.js";

const router = Router();

// POST /portal/v1/api/bookings
router.get("/bookings", BookingController.index);

// POST /portal/v1/api/bookings/:id
router.get("/bookings/:id", BookingController.show);

// POST /portal/v1/api/booking/class
router.post("/booking/class", BookingController.create);

export default router;

