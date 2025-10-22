#!/usr/bin/env node

const { spawnSync } = require("child_process");
const path = require("path");

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error("[m-reader] No command supplied to run-with-migrations.");
  process.exit(1);
}

const migrationsScript = path.join(__dirname, "run-migrations.cjs");

const migrationsResult = spawnSync("node", [migrationsScript], {
  stdio: "inherit",
  env: process.env,
});

if (migrationsResult.status !== 0) {
  process.exit(migrationsResult.status ?? 1);
}

const env = { ...process.env };
const fallbackPort = env.PORT || env.APP_PORT || "1314";

if (!env.PORT) {
  env.PORT = fallbackPort;
}

if (!env.APP_PORT) {
  env.APP_PORT = fallbackPort;
}

const commandResult = spawnSync(args[0], args.slice(1), {
  stdio: "inherit",
  env,
});

if (commandResult.error) {
  console.error(commandResult.error);
}

process.exit(commandResult.status ?? 1);
