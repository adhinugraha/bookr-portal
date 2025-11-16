import dotenv from "dotenv";
dotenv.config();

export const config = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.API_PORT || "3000",
  API_VERSION: process.env.API_VERSION || "v1",

  // Internal
  JWT_SECRET: process.env.JWT_SECRET || "secret",

  // Database
  DATABASE_URL: process.env.DATABASE_URL || "",

  // Cache
  REDIS_URL: process.env.REDIS_URL || "",

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  
  // GymMaster
  GYMMASTER_BASE_URL: process.env.GYMMASTER_BASE_URL || "",
  GYMMASTER_API_KEY_STAFF: process.env.GYMMASTER_API_KEY_STAFF || "",
  GYMMASTER_API_KEY_MEMBER: process.env.GYMMASTER_API_KEY_MEMBER || "",
  GYMMASTER_COMPANY_ID: process.env.GYMMASTER_COMPANY_ID || "",

  // Xendit
  XENDIT_BASE_URL: process.env.XENDIT_BASE_URL || "",
  XENDIT_SECRET_KEY: process.env.XENDIT_SECRET_KEY || "",
  XENDIT_API_KEY: process.env.XENDIT_API_KEY || "",
  XENDIT_WEBHOOK_TOKEN: process.env.XENDIT_WEBHOOK_TOKEN || "",
};
