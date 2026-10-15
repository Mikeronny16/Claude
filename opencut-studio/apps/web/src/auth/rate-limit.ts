import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { isWebEnvConfigured, requireWebEnv } from "@/env/web";

let _baseRateLimit: Ratelimit | null = null;

function getBaseRateLimit(): Ratelimit {
	if (!_baseRateLimit) {
		const env = requireWebEnv(
			"UPSTASH_REDIS_REST_URL",
			"UPSTASH_REDIS_REST_TOKEN",
		);
		_baseRateLimit = new Ratelimit({
			redis: new Redis({
				url: env.UPSTASH_REDIS_REST_URL,
				token: env.UPSTASH_REDIS_REST_TOKEN,
			}),
			limiter: Ratelimit.slidingWindow(100, "1 m"), // 100 requests per minute
			analytics: true,
			prefix: "rate-limit",
		});
	}
	return _baseRateLimit;
}

let hasWarnedRateLimitDisabled = false;

export async function checkRateLimit({ request }: { request: Request }) {
	// Without Redis (desktop, local dev) there is no shared store to count in,
	// and the only caller is the local user, so requests are not limited.
	if (!isWebEnvConfigured("UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN")) {
		if (!hasWarnedRateLimitDisabled) {
			hasWarnedRateLimitDisabled = true;
			console.warn("[rate-limit] Upstash Redis is not configured; rate limiting is disabled.");
		}
		return { success: true, limited: false };
	}

	const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
	const { success } = await getBaseRateLimit().limit(ip);
	return { success, limited: !success };
}
