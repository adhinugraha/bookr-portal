import Redis from "ioredis";
import logger from "../config/logger.js";
import { config } from "../config/env.js";

export const redis = new Redis.default(config.REDIS_URL);

redis.on("connect", () => logger.info("Connected to Redis"));
redis.on("error", (err) => logger.error("Redis error: %s", err.message));

