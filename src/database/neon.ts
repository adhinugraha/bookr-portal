import { Client, neon } from "@neondatabase/serverless";
import logger from "../config/logger.js";
import { config } from "../config/env.js";

let sqlImpl: any;
try {
  sqlImpl = neon(config.DATABASE_URL);
} catch {
  sqlImpl = undefined;
}

export const sql = (...args: any[]) => {
  if (!sqlImpl) {
    throw new Error("NEON_DATABASE_URL is invalid or not set");
  }
  return sqlImpl(...args);
};

export const neonClient = new Client({
  connectionString: config.DATABASE_URL,
});

export const connectNeon = async () => {
  try {
    await neonClient.connect();
    logger.info("Connected to Neon successfully");
  } catch (err) {
    logger.error({ msg: "Neon connection failed", err });
    throw err;
  }
};
