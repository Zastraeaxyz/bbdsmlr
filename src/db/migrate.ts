import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { createClient } from "@libsql/client";
import { dirname, resolve } from "path";
import { existsSync, mkdirSync } from "fs";

const dbPath = process.env.DATABASE_PATH
  ? resolve(process.env.DATABASE_PATH)
  : resolve(process.cwd(), "drizzle", "data", "db.sqlite");
const dbDir = dirname(dbPath);

if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true });
}

const client = createClient({
  url: `file:${dbPath}`,
});

const db = drizzle(client);

async function main() {
  const migrationsFolder = resolve(import.meta.dirname, "migrations");

  if (!existsSync(migrationsFolder)) {
    console.log("No migrations folder found, skipping.");
    process.exit(0);
  }

  await migrate(db, { migrationsFolder });
  console.log("Migrations complete!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
