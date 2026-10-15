import { ThemeProvider } from "next-themes";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "../components/ui/sonner";
import { ChangelogNotification } from "@/changelog/components/changelog-notification";
import { TooltipProvider } from "../components/ui/tooltip";
import { baseMetaData } from "./metadata";
import { BotIdClient } from "botid/client";
import { webEnv } from "@/env/web";
import {
	Bricolage_Grotesque,
	Inter,
	Manrope,
	Plus_Jakarta_Sans,
} from "next/font/google";
import { DEFAULT_DESIGN, designInitScript } from "@/design/designs";

// One UI font per design (see app/globals.css); next/font self-hosts them,
// so they work offline.
const interFont = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jakartaFont = Plus_Jakarta_Sans({
	subsets: ["latin"],
	variable: "--font-jakarta",
});
const manropeFont = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const bricolageFont = Bricolage_Grotesque({
	subsets: ["latin"],
	variable: "--font-bricolage",
});
const fontVariables = [interFont, jakartaFont, manropeFont, bricolageFont]
	.map((font) => font.variable)
	.join(" ");

export const metadata = baseMetaData;

const protectedRoutes = [
	{
		path: "/none",
		method: "GET",
	},
];

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={fontVariables}
			data-palette={DEFAULT_DESIGN.palette}
			data-font={DEFAULT_DESIGN.font}
			data-corners={DEFAULT_DESIGN.corners}
			suppressHydrationWarning
		>
			<head>
				<script dangerouslySetInnerHTML={{ __html: designInitScript }} />
				<BotIdClient protect={protectedRoutes} />
				{process.env.NODE_ENV === "development" && (
					<>
						<Script
							src="//unpkg.com/react-scan/dist/auto.global.js"
							crossOrigin="anonymous"
							strategy="beforeInteractive"
						/>
					</>
				)}
			</head>
			<body className="font-sans antialiased">
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					disableTransitionOnChange={true}
				>
					<TooltipProvider>
						<Toaster />
						{webEnv.NEXT_PUBLIC_DATABUDDY_CLIENT_ID && (
							<Script
								src="https://cdn.databuddy.cc/databuddy.js"
								strategy="afterInteractive"
								async
								data-client-id={webEnv.NEXT_PUBLIC_DATABUDDY_CLIENT_ID}
								data-disabled={webEnv.NODE_ENV === "development"}
								data-track-attributes={false}
								data-track-errors={true}
								data-track-outgoing-links={false}
								data-track-web-vitals={false}
								data-track-sessions={false}
							/>
						)}
						{children}
					</TooltipProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
