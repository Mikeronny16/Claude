import { protocol } from "electron";

// The editor keeps projects in IndexedDB and OPFS, which are scoped to the page
// origin. Serving it from a fixed app://studio origin, instead of the server's
// random localhost port, keeps a user's projects across launches.
export const APP_SCHEME = "app";
export const APP_HOST = "studio";
export const APP_ORIGIN = `${APP_SCHEME}://${APP_HOST}`;

/** Must run before the app is ready. */
export function registerAppScheme(): void {
	protocol.registerSchemesAsPrivileged([
		{
			scheme: APP_SCHEME,
			privileges: {
				// standard + secure: a real origin with storage, and a secure
				// context so WebCodecs and OPFS are available.
				standard: true,
				secure: true,
				supportFetchAPI: true,
				corsEnabled: true,
				stream: true,
				codeCache: true,
			},
		},
	]);
}

// Hop-by-hop or encoding headers that must not be copied between the two legs.
const DROPPED_REQUEST_HEADERS = ["host", "accept-encoding", "connection"];
const DROPPED_RESPONSE_HEADERS = ["content-encoding", "content-length", "transfer-encoding", "connection"];

/** Proxies app://studio/* to the editor server. Call after the app is ready. */
export function serveAppScheme({ serverOrigin }: { serverOrigin: string }): void {
	protocol.handle(APP_SCHEME, async (request) => {
		const url = new URL(request.url);
		if (url.host !== APP_HOST) {
			return new Response("Not found", { status: 404 });
		}

		const headers = new Headers(request.headers);
		for (const name of DROPPED_REQUEST_HEADERS) headers.delete(name);

		const hasBody = request.method !== "GET" && request.method !== "HEAD";
		const upstream = await fetch(`${serverOrigin}${url.pathname}${url.search}`, {
			method: request.method,
			headers,
			body: hasBody ? request.body : undefined,
			redirect: "manual",
			// Required by undici to stream a request body.
			...(hasBody ? { duplex: "half" } : {}),
		} as RequestInit);

		const responseHeaders = new Headers(upstream.headers);
		for (const name of DROPPED_RESPONSE_HEADERS) responseHeaders.delete(name);
		const location = responseHeaders.get("location");
		if (location?.startsWith(serverOrigin)) {
			responseHeaders.set("location", APP_ORIGIN + location.slice(serverOrigin.length));
		}

		return new Response(upstream.body, {
			status: upstream.status,
			statusText: upstream.statusText,
			headers: responseHeaders,
		});
	});
}
