import express from "express";
import authRoute from "./routes/portal/v1/auth.routes.js";
import userRoute from "./routes/portal/v1/user.routes.js";
import classRoute from "./routes/portal/v1/class.routes.js";
import bookingRoute from "./routes/portal/v1/booking.routes.js";
import invoiceRoute from "./routes/portal/v1/invoice.routes.js";
import { errorMiddleware } from "./core/middleware/error.middleware.js";
import { AuthMiddleware } from "./core/middleware/auth.middleware.js";

const app = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use("/portal/v1/api",
  authRoute
);

app.use("/portal/v1/api",
  AuthMiddleware.verifyToken,
  userRoute,
  classRoute,
  bookingRoute,
  invoiceRoute
);

app.use(errorMiddleware);

export default app;