import express from "express";
import authRoute from "./routes/portal/v1/auth.routes.js";
import userRoute from "./routes/portal/v1/user.routes.js";
import { errorMiddleware } from "./core/middleware/error.middleware.js";

const app = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use("/portal/v1/api",
  authRoute,
  userRoute
);

app.use(errorMiddleware);

export default app;