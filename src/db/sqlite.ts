import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { dirname, resolve } from "path";
import { existsSync, mkdirSync } from "fs";
import * as schema from "./schema";

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

export const db = drizzle(client, { schema });
