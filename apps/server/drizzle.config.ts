import { defineConfig } from "drizzle-kit";

export default defineConfig({
    out: "./drizzle",
    dialect: "postgresql",
    schema: "./src/db/schemas/**/*.ts",
    dbCredentials: {
        url: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST || 'localhost'}:5432/${process.env.DB_NAME}`,
    },
})