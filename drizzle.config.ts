import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/schema.js",   // schema file path
  out: "./drizzle",            // migrations folder
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.SUPABASE_DB_URL!,
  },
});
