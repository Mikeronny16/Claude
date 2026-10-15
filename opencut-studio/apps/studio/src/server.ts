import { app, utilityProcess, type UtilityProcess } from "electron";
import { existsSync } from "node:fs";
import { createServer, type AddressInfo } from "node:net";
import { join } from "node:path";

export type EditorServer = {
	origin: string;
	stop: () => void;
};

const STARTUP_TIMEOUT_MS = 30_000;

function serverRoot(): string {
	// Packaged builds ship the server as an extra resource beside app.asar.
	return app.isPackaged
		? join(process.resourcesPath, "server")
		: join(app.getAppPath(), "build/server");
}

function getFreePort(): Promise<number> {
	return new Promise((resolve, reject) => {
		const probe = createServer();
		probe.unref();
		probe.on("error", reject);
		probe.listen(0, "127.0.0.1", () => {
			const { port } = probe.address() as AddressInfo;
			probe.close(() => resolve(port));
		});
	});
}

async function waitUntilHealthy({
	origin,
	child,
}: {
	origin: string;
	child: UtilityProcess;
}): Promise<void> {
	let exitCode: number | null = null;
	const onExit = (code: number) => {
		exitCode = code;
	};
	child.once("exit", onExit);

	const deadline = Date.now() + STARTUP_TIMEOUT_MS;
	try {
		while (Date.now() < deadline) {
			if (exitCode !== null) {
				throw new Error(`Editor server exited during startup (code ${exitCode})`);
			}
			try {
				const response = await fetch(`${origin}/api/health`);
				if (response.ok) return;
			} catch {
				// Not listening yet.
			}
			await new Promise((resolve) => setTimeout(resolve, 100));
		}
		throw new Error(`Editor server did not start within ${STARTUP_TIMEOUT_MS / 1000}s`);
	} finally {
		child.off("exit", onExit);
	}
}

/** Runs the editor's Next.js standalone server on a free loopback port. */
export async function startEditorServer(): Promise<EditorServer> {
	const serverScript = join(serverRoot(), "apps/web/server.js");
	if (!existsSync(serverScript)) {
		throw new Error(
			`Editor server not found at ${serverScript}. Run \`bun run build\` in apps/studio.`,
		);
	}

	const port = await getFreePort();
	const origin = `http://127.0.0.1:${port}`;
	const child = utilityProcess.fork(serverScript, [], {
		serviceName: "OpenCut Studio editor server",
		stdio: "pipe",
		env: {
			...process.env,
			NODE_ENV: "production",
			PORT: String(port),
			HOSTNAME: "127.0.0.1",
			NEXT_TELEMETRY_DISABLED: "1",
		},
	});
	child.stdout?.on("data", (chunk: Buffer) => process.stdout.write(`[server] ${chunk}`));
	child.stderr?.on("data", (chunk: Buffer) => process.stderr.write(`[server] ${chunk}`));

	try {
		await waitUntilHealthy({ origin, child });
	} catch (error) {
		child.kill();
		throw error;
	}

	return { origin, stop: () => child.kill() };
}
