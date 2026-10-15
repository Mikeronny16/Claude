import { z } from "zod";

// Only NODE_ENV is required. Every integration below is optional so the editor
// (which needs none of them) builds and runs offline, e.g. in OpenCut Studio
// desktop. Code that needs an integration asks for it with `requireWebEnv`.
const webEnvSchema = z.object({
	// Node
	NODE_ENV: z.enum(["development", "production", "test"]),
	ANALYZE: z.string().optional(),
	NEXT_RUNTIME: z.enum(["nodejs", "edge"]).optional(),

	// Public
	NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
	NEXT_PUBLIC_MARBLE_API_URL: z.url().default("https://api.marblecms.com"),
	// Analytics load only when this is set; desktop builds ship without it.
	NEXT_PUBLIC_DATABUDDY_CLIENT_ID: z.string().optional(),

	// Server integrations
	DATABASE_URL: z
		.string()
		.refine(
			(url) =>
				url.startsWith("postgres://") || url.startsWith("postgresql://"),
			"DATABASE_URL must be a postgres:// or postgresql:// URL",
		)
		.optional(),

	BETTER_AUTH_SECRET: z.string().optional(),
	UPSTASH_REDIS_REST_URL: z.url().optional(),
	UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
	MARBLE_WORKSPACE_KEY: z.string().optional(),
	FREESOUND_CLIENT_ID: z.string().optional(),
	FREESOUND_API_KEY: z.string().optional(),
});

export type WebEnv = z.infer<typeof webEnvSchema>;

export const webEnv = webEnvSchema.parse(process.env);

type OptionalWebEnvKey = {
	[K in keyof WebEnv]-?: undefined extends WebEnv[K] ? K : never;
}[keyof WebEnv];

export class IntegrationNotConfiguredError extends Error {
	constructor(readonly missing: OptionalWebEnvKey[]) {
		super(`Not configured: set ${missing.join(", ")}`);
		this.name = "IntegrationNotConfiguredError";
	}
}

type WebEnvWith<K extends OptionalWebEnvKey> = WebEnv & {
	[P in K]-?: NonNullable<WebEnv[P]>;
};

function hasWebEnv<K extends OptionalWebEnvKey>(
	env: WebEnv,
	keys: K[],
): env is WebEnvWith<K> {
	return keys.every((key) => Boolean(env[key]));
}

export function isWebEnvConfigured(...keys: OptionalWebEnvKey[]): boolean {
	return hasWebEnv(webEnv, keys);
}

export function requireWebEnv<K extends OptionalWebEnvKey>(
	...keys: K[]
): WebEnvWith<K> {
	if (!hasWebEnv(webEnv, keys)) {
		throw new IntegrationNotConfiguredError(keys.filter((key) => !webEnv[key]));
	}
	return webEnv;
}
