import app from "./index.js";
import { logger } from "./config/logger.js";

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen(port, () => {
  logger.info(`Bookr API running at http://localhost:${port}`);
});