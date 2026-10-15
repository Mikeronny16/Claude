"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useEditor } from "@/editor/use-editor";
import { useElementSelection } from "@/timeline/hooks/element/use-element-selection";
import { usePropertiesStore } from "./stores/properties-store";
import { getPropertiesConfig } from "./registry";
import { cn } from "@/utils/ui";
import { EmptyView } from "./empty-view";

export function PropertiesPanel() {
	const editor = useEditor();
	useEditor((e) => e.scenes.getActiveSceneOrNull());
	useEditor((e) => e.media.getAssets());
	const { selectedElements } = useElementSelection();
	const { activeTabPerType, setActiveTab } = usePropertiesStore();

	if (selectedElements.length === 0) {
		return (
			<InspectorFrame>
				<EmptyView />
			</InspectorFrame>
		);
	}

	if (selectedElements.length > 1) {
		return (
			<InspectorFrame>
				<p className="text-muted-foreground grid h-full place-items-center p-4 text-center text-sm">
					{selectedElements.length} clips selected. Select one to edit it.
				</p>
			</InspectorFrame>
		);
	}

	const mediaAssets = editor.media.getAssets();

	const elementsWithTracks = editor.timeline.getElementsWithTracks({
		elements: selectedElements,
	});
	const elementWithTrack = elementsWithTracks[0];

	if (!elementWithTrack) return null;

	const { element, track } = elementWithTrack;
	const config = getPropertiesConfig({ element, mediaAssets });
	const visibleTabs = config.tabs;

	const storedTabId = activeTabPerType[element.type];
	const isStoredTabVisible = visibleTabs.some((t) => t.id === storedTabId);
	const activeTabId = isStoredTabVisible ? storedTabId : config.defaultTab;
	const activeTab =
		visibleTabs.find((t) => t.id === activeTabId) ?? visibleTabs[0];

	if (!activeTab) return null;

	return (
		<InspectorFrame title={element.name}>
			<div
				role="tablist"
				aria-label="Clip settings"
				className="scrollbar-hidden flex shrink-0 gap-0.5 overflow-x-auto border-b px-1.5"
			>
				{visibleTabs.map((tab) => {
					const isActive = tab.id === activeTab.id;
					return (
						<button
							key={tab.id}
							type="button"
							role="tab"
							aria-selected={isActive}
							onClick={() =>
								setActiveTab({
									elementType: element.type,
									tabId: tab.id,
								})
							}
							className={cn(
								"text-muted-foreground relative flex min-w-[3.4rem] flex-1 flex-col items-center gap-1 px-1 pt-2 pb-1.5 text-[0.65rem] leading-none font-medium transition-colors duration-150",
								"hover:text-foreground focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none focus-visible:ring-inset",
								"[&_svg]:size-4",
								isActive && "text-primary",
							)}
						>
							{tab.icon}
							{tab.label}
							{isActive && (
								<span
									aria-hidden
									className="bg-primary absolute right-2 bottom-0 left-2 h-0.5 rounded-full"
								/>
							)}
						</button>
					);
				})}
			</div>
			<ScrollArea role="tabpanel" className="min-h-0 flex-1 scrollbar-hidden">
				{activeTab.content({ trackId: track.id })}
			</ScrollArea>
		</InspectorFrame>
	);
}

/** The Inspector's panel with its title row. */
function InspectorFrame({
	title,
	children,
}: {
	title?: string;
	children: React.ReactNode;
}) {
	return (
		<section
			aria-label="Inspector"
			className="panel bg-background flex h-full flex-col overflow-hidden rounded-sm border"
		>
			<header className="flex shrink-0 items-center justify-between gap-3 border-b px-3 py-2">
				<span className="text-xs font-semibold">Inspector</span>
				{title && (
					<span className="text-muted-foreground truncate text-xs">{title}</span>
				)}
			</header>
			<div className="flex min-h-0 flex-1 flex-col">{children}</div>
		</section>
	);
}
