#!/usr/bin/env node

const DEFAULT_DB_CREDENTIAL = "20251022";

const timestamp = new Date().toISOString();
console.info(`[m-reader] ${timestamp} - running placeholder database migrations.`);

const missingHostOrPort = !process.env.DB_HOST || !process.env.DB_PORT;
if (missingHostOrPort) {
  console.warn(
    "[m-reader] DB_HOST or DB_PORT is not configured. Database connectivity features will remain idle until configured.",
  );
}

if (!process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_PASSWORD) {
  console.warn(
    `[m-reader] Using default placeholder credentials (${DEFAULT_DB_CREDENTIAL}) for DB_NAME, DB_USER and DB_PASSWORD. Update these values in your environment before enabling persistence.`,
  );
}
