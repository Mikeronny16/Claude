import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { requireWebEnv } from "@/env/web";

let _db: ReturnType<typeof drizzle> | null = null;

// Connects on first use, so modules that import the database don't require
// DATABASE_URL until they actually query.
export function getDb() {
	if (!_db) {
		const { DATABASE_URL } = requireWebEnv("DATABASE_URL");
		const client = postgres(DATABASE_URL);
		_db = drizzle(client, { schema });
	}

	return _db;
}

export * from "./schema";
