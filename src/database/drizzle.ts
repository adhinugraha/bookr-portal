import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema/index.js";
import { config } from "../config/env.js";

if (!config.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const sql = neon(config.DATABASE_URL);
export const db = drizzle(sql, { schema });
