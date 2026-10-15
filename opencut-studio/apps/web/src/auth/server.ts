import { betterAuth, type RateLimit } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { Redis } from "@upstash/redis";
import { getDb } from "@/db";
import { isWebEnvConfigured, requireWebEnv, webEnv } from "@/env/web";

function createAuth() {
	const env = requireWebEnv(
		"DATABASE_URL",
		"BETTER_AUTH_SECRET",
		"UPSTASH_REDIS_REST_URL",
		"UPSTASH_REDIS_REST_TOKEN",
	);

	const redis = new Redis({
		url: env.UPSTASH_REDIS_REST_URL,
		token: env.UPSTASH_REDIS_REST_TOKEN,
	});

	return betterAuth({
		database: drizzleAdapter(getDb(), {
			provider: "pg",
			usePlural: true,
		}),
		secret: env.BETTER_AUTH_SECRET,
		user: {
			deleteUser: {
				enabled: true,
			},
		},
		emailAndPassword: {
			enabled: true,
		},
		rateLimit: {
			storage: "secondary-storage",
			customStorage: {
				get: async (key) => {
					const value = await redis.get(key);
					return value as RateLimit | undefined;
				},
				set: async (key, value) => {
					await redis.set(key, value);
				},
			},
		},
		baseURL: webEnv.NEXT_PUBLIC_SITE_URL,
		appName: "OpenCut",
		trustedOrigins: [webEnv.NEXT_PUBLIC_SITE_URL],
	});
}

export type Auth = ReturnType<typeof createAuth>;

let _auth: Auth | null = null;

export function isAuthConfigured(): boolean {
	return isWebEnvConfigured(
		"DATABASE_URL",
		"BETTER_AUTH_SECRET",
		"UPSTASH_REDIS_REST_URL",
		"UPSTASH_REDIS_REST_TOKEN",
	);
}

export function getAuth(): Auth {
	_auth ??= createAuth();
	return _auth;
}
