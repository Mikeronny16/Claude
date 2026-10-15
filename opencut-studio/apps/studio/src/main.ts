import {
	app,
	BrowserWindow,
	dialog,
	session,
	shell,
	type DownloadItem,
	type WebContents,
} from "electron";
import { extname, join } from "node:path";
import { APP_ORIGIN, HOME_PATH, registerAppScheme, serveAppScheme } from "./protocol";
import { startEditorServer, type EditorServer } from "./server";

// Test hooks: isolate app data and send exports to a known folder.
const userDataDir = process.env.OPENCUT_STUDIO_USER_DATA_DIR;
const exportDir = process.env.OPENCUT_STUDIO_EXPORT_DIR;

app.setName("OpenCut Studio");
if (userDataDir) app.setPath("userData", userDataDir);

// Use SwiftShader for WebGL when there is no usable GPU, instead of leaving the
// compositor without WebGL. "Unsafe" refers to untrusted web content; this
// window only ever loads the app's own pages (see guardNavigation).
app.commandLine.appendSwitch("enable-unsafe-swiftshader");

registerAppScheme();

let editorServer: EditorServer | null = null;
let mainWindow: BrowserWindow | null = null;

function isAppUrl(url: string): boolean {
	return url === APP_ORIGIN || url.startsWith(`${APP_ORIGIN}/`);
}

function openExternally(url: string): void {
	if (url.startsWith("https://") || url.startsWith("http://")) {
		void shell.openExternal(url);
	}
}

function guardNavigation(contents: WebContents): void {
	contents.setWindowOpenHandler(({ url }) => {
		openExternally(url);
		return { action: "deny" };
	});
	contents.on("will-navigate", (event, url) => {
		if (isAppUrl(url)) return;
		event.preventDefault();
		openExternally(url);
	});
}

const ALLOWED_PERMISSIONS = new Set([
	"clipboard-read",
	"clipboard-sanitized-write",
	"fullscreen",
	"media",
]);

function configureSession(): void {
	const ses = session.defaultSession;

	ses.setPermissionRequestHandler((contents, permission, callback) => {
		callback(isAppUrl(contents.getURL()) && ALLOWED_PERMISSIONS.has(permission));
	});
	ses.setPermissionCheckHandler((_contents, permission, requestingOrigin) => {
		return requestingOrigin === APP_ORIGIN && ALLOWED_PERMISSIONS.has(permission);
	});

	// The editor exports by "downloading" the rendered file; route that to a
	// native save dialog (or the test export folder).
	ses.on("will-download", (_event, item: DownloadItem) => {
		const filename = item.getFilename();
		if (exportDir) {
			item.setSavePath(join(exportDir, filename));
			return;
		}
		const extension = extname(filename).slice(1);
		item.setSaveDialogOptions({
			title: "Save exported video",
			defaultPath: join(app.getPath("videos"), filename),
			filters: extension
				? [{ name: `${extension.toUpperCase()} video`, extensions: [extension] }]
				: [],
		});
	});
}

async function createMainWindow(): Promise<void> {
	mainWindow = new BrowserWindow({
		title: "OpenCut Studio",
		width: 1440,
		height: 900,
		minWidth: 1024,
		minHeight: 640,
		backgroundColor: "#09090b",
		show: false,
		webPreferences: {
			contextIsolation: true,
			sandbox: true,
			nodeIntegration: false,
			spellcheck: false,
		},
	});
	mainWindow.once("ready-to-show", () => mainWindow?.show());
	mainWindow.on("closed", () => {
		mainWindow = null;
	});
	await mainWindow.loadURL(`${APP_ORIGIN}${HOME_PATH}`);
}

if (!app.requestSingleInstanceLock()) {
	app.quit();
} else {
	app.on("second-instance", () => {
		if (!mainWindow) return;
		if (mainWindow.isMinimized()) mainWindow.restore();
		mainWindow.focus();
	});

	app.on("web-contents-created", (_event, contents) => guardNavigation(contents));

	app.on("window-all-closed", () => {
		if (process.platform !== "darwin") app.quit();
	});

	app.on("activate", () => {
		if (!mainWindow && editorServer) void createMainWindow();
	});

	app.on("will-quit", () => {
		editorServer?.stop();
		editorServer = null;
	});

	app.whenReady().then(async () => {
		try {
			editorServer = await startEditorServer();
		} catch (error) {
			dialog.showErrorBox(
				"OpenCut Studio could not start",
				error instanceof Error ? error.message : String(error),
			);
			app.exit(1);
			return;
		}
		serveAppScheme({ serverOrigin: editorServer.origin });
		configureSession();
		await createMainWindow();
	});
}
