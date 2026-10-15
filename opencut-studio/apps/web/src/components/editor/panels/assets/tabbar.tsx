"use client";

import {
	type ElementType,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { Home01Icon, TransitionTopIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/utils/ui";
import {
	TAB_KEYS,
	tabs,
	useAssetsPanelStore,
} from "@/components/editor/panels/assets/assets-panel-store";
import { useExportPopoverStore } from "@/components/editor/export-button";
import { useExitProject } from "@/project/use-exit-project";

const ProjectsIcon = ({ className }: { className?: string }) => (
	<HugeiconsIcon icon={Home01Icon} className={className} />
);
const ExportIcon = ({ className }: { className?: string }) => (
	<HugeiconsIcon icon={TransitionTopIcon} className={className} />
);

/** Orbit Navigation: the editor's sections, with Projects and Export at the ends. */
export function TabBar() {
	const { activeTab, setActiveTab } = useAssetsPanelStore();
	const { exitProject, isExiting } = useExitProject();
	const openExport = useExportPopoverStore((state) => state.setOpen);
	const [showTopFade, setShowTopFade] = useState(false);
	const [showBottomFade, setShowBottomFade] = useState(false);
	const scrollRef = useRef<HTMLDivElement>(null);

	const checkScrollPosition = useCallback(() => {
		const element = scrollRef.current;
		if (!element) return;

		const { scrollTop, scrollHeight, clientHeight } = element;
		setShowTopFade(scrollTop > 0);
		setShowBottomFade(scrollTop < scrollHeight - clientHeight - 1);
	}, []);

	useEffect(() => {
		const element = scrollRef.current;
		if (!element) return;

		checkScrollPosition();
		element.addEventListener("scroll", checkScrollPosition);

		const resizeObserver = new ResizeObserver(checkScrollPosition);
		resizeObserver.observe(element);

		return () => {
			element.removeEventListener("scroll", checkScrollPosition);
			resizeObserver.disconnect();
		};
	}, [checkScrollPosition]);

	return (
		<nav aria-label="Editor sections" className="relative flex">
			<div
				ref={scrollRef}
				className="scrollbar-hidden relative flex w-[4.25rem] flex-col gap-0.5 overflow-y-auto p-1.5"
			>
				<OrbitNavItem
					icon={ProjectsIcon}
					label="Projects"
					onClick={exitProject}
					disabled={isExiting}
				/>
				<div aria-hidden className="bg-border mx-3 my-1 h-px shrink-0" />
				{TAB_KEYS.map((tabKey) => {
					const tab = tabs[tabKey];
					return (
						<OrbitNavItem
							key={tabKey}
							icon={tab.icon}
							label={tab.label}
							isActive={activeTab === tabKey}
							comingSoon={"comingSoon" in tab}
							onClick={() => setActiveTab(tabKey)}
						/>
					);
				})}
				<div aria-hidden className="bg-border mx-3 my-1 h-px shrink-0" />
				<OrbitNavItem
					icon={ExportIcon}
					label="Export"
					onClick={() => openExport(true)}
				/>
			</div>

			<FadeOverlay direction="top" show={showTopFade} />
			<FadeOverlay direction="bottom" show={showBottomFade} />
		</nav>
	);
}

function OrbitNavItem({
	icon: Icon,
	label,
	isActive = false,
	comingSoon = false,
	onClick,
	disabled,
}: {
	icon: ElementType<{ className?: string }>;
	label: string;
	isActive?: boolean;
	comingSoon?: boolean;
	onClick: () => void;
	disabled?: boolean;
}) {
	return (
		<Tooltip delayDuration={400}>
			<TooltipTrigger asChild>
				<button
					type="button"
					aria-current={isActive ? "page" : undefined}
					onClick={onClick}
					disabled={disabled}
					className={cn(
						"text-muted-foreground relative flex shrink-0 flex-col items-center gap-1 rounded-md px-0.5 pt-1.5 pb-1 text-[0.62rem] leading-none font-medium transition-colors duration-150",
						"hover:bg-accent hover:text-foreground focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50",
						isActive && "bg-accent text-primary",
					)}
				>
					{isActive && (
						<span
							aria-hidden
							className="bg-primary absolute top-2 bottom-2 left-0 w-0.5 rounded-full"
						/>
					)}
					<span
						className={cn(
							"grid size-7 place-items-center rounded-full",
							isActive && "ring-primary/45 ring-1",
						)}
					>
						<Icon className="size-[1.05rem]" />
					</span>
					<span className={cn(comingSoon && "opacity-60")}>{label}</span>
				</button>
			</TooltipTrigger>
			<TooltipContent side="right" align="center" variant="sidebar" sideOffset={8}>
				<div className="text-foreground text-sm leading-none font-medium">
					{comingSoon ? `${label} (coming soon)` : label}
				</div>
			</TooltipContent>
		</Tooltip>
	);
}

function FadeOverlay({
	direction,
	show,
}: {
	direction: "top" | "bottom";
	show: boolean;
}) {
	return (
		<div
			className={cn(
				"pointer-events-none absolute right-0 left-0 h-6",
				direction === "top" && show
					? "from-background top-0 bg-linear-to-b to-transparent"
					: "from-background bottom-0 bg-linear-to-t to-transparent",
			)}
		/>
	);
}
