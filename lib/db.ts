import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@/lib/schema";

const pool = new Pool({
  connectionString: process.env.SUPABASE_DB_URL,
});

export const db = drizzle(pool, { schema });
