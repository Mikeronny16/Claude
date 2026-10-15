"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, SendHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useEditor } from "@/editor/use-editor";
import { cn } from "@/utils/ui";
import { mediaTimeToSeconds } from "@/wasm";
import { CopilotPreview } from "../apply";
import { buildCopilotContext, type CopilotContext } from "../context";
import { useCopilotStore } from "../copilot-store";
import { DEMO_HELP, planFromDemo } from "../demo-planner";
import { prepareCopilotSteps } from "../prepare";
import { describeCopilotStep, type CopilotPlan } from "../steps";

type Mode = "checking" | "claude" | "demo";

type Entry = {
	id: number;
	request: string;
	status: "thinking" | "ready" | "previewing" | "applied" | "discarded" | "error";
	plan?: CopilotPlan;
	clips?: CopilotContext["clips"];
	enabled: boolean[];
	notes: string[];
	progress?: string;
	error?: string;
};

const SUGGESTIONS: Record<Exclude<Mode, "checking">, string[]> = {
	demo: ["Remove silences", "Add captions", "Add title Hello"],
	claude: ["Remove the silences", "Add captions", "Cut the first 2 seconds"],
};

async function requestClaudePlan({
	request,
	context,
}: {
	request: string;
	context: CopilotContext;
}): Promise<CopilotPlan> {
	const response = await fetch("/api/copilot", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ request, context }),
	});
	const body = await response.json().catch(() => ({}));
	if (!response.ok || !body.plan) {
		throw new Error(body.error ?? body.message ?? "The Copilot couldn't answer.");
	}
	return body.plan;
}

/**
 * AI Copilot: turns a request into a plan of editing steps. Nothing changes
 * until the user previews or applies it; applying is one undo step.
 */
export function CopilotPanel() {
	const editor = useEditor();
	const setOpen = useCopilotStore((state) => state.setOpen);
	const previewRef = useRef<CopilotPreview | null>(null);
	previewRef.current ??= new CopilotPreview(editor);
	const [mode, setMode] = useState<Mode>("checking");
	const [entries, setEntries] = useState<Entry[]>([]);
	const [draft, setDraft] = useState("");
	const nextId = useRef(1);
	const listRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		let cancelled = false;
		fetch("/api/copilot")
			.then((response) => response.json())
			.then((body) => !cancelled && setMode(body.configured ? "claude" : "demo"))
			.catch(() => !cancelled && setMode("demo"));
		const preview = previewRef.current;
		return () => {
			cancelled = true;
			// Leaving the panel never leaves an unapproved plan on the timeline.
			preview?.discard();
		};
	}, []);

	useEffect(() => {
		listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
	}, [entries]);

	const update = (id: number, patch: Partial<Entry>) =>
		setEntries((current) => current.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)));

	const stopPreview = () => {
		if (!previewRef.current?.isActive) return;
		previewRef.current.discard();
		setEntries((current) =>
			current.map((entry) => (entry.status === "previewing" ? { ...entry, status: "ready", notes: [] } : entry)),
		);
	};

	const send = async (text: string) => {
		const request = text.trim();
		if (!request || mode === "checking") return;
		stopPreview();
		setDraft("");
		const id = nextId.current++;
		const context = buildCopilotContext({
			tracks: editor.scenes.getActiveScene().tracks,
			playhead: mediaTimeToSeconds({ time: editor.playback.getCurrentTime() }),
			duration: mediaTimeToSeconds({ time: editor.timeline.getTotalDuration() }),
			selectedClipIds: editor.selection.getSelectedElements().map((ref) => ref.elementId),
		});
		setEntries((current) => [...current, { id, request, status: "thinking", enabled: [], notes: [] }]);
		try {
			const proposed =
				mode === "claude"
					? await requestClaudePlan({ request, context })
					: planFromDemo({ request, context });
			// Silences and captions need the audio first, so the plan shows real
			// times and text.
			const prepared = await prepareCopilotSteps({
				editor,
				steps: proposed.steps,
				onProgress: (progress) => update(id, { progress }),
			});
			const message =
				prepared.steps.length === 0 && prepared.notes.length > 0
					? prepared.notes.join(" ")
					: [proposed.message, ...prepared.notes].join(" ");
			const plan = { message, steps: prepared.steps };
			update(id, {
				status: "ready",
				plan,
				clips: context.clips,
				enabled: plan.steps.map(() => true),
			});
		} catch (error) {
			update(id, {
				status: "error",
				error: error instanceof Error ? error.message : "The Copilot couldn't answer.",
			});
		}
	};

	const preview = (entry: Entry) => {
		if (!entry.plan) return [];
		stopPreview();
		const steps = entry.plan.steps.filter((_, index) => entry.enabled[index]);
		const notes = previewRef.current?.start({ steps }) ?? [];
		update(entry.id, { status: "previewing", notes });
		return notes;
	};

	const apply = (entry: Entry) => {
		const notes = entry.status === "previewing" ? entry.notes : preview(entry);
		previewRef.current?.commit();
		update(entry.id, { status: "applied", notes });
	};

	const discard = (entry: Entry) => {
		if (entry.status === "previewing") previewRef.current?.discard();
		update(entry.id, { status: "discarded", notes: [] });
	};

	const toggleStep = (entry: Entry, index: number) => {
		const enabled = entry.enabled.map((value, i) => (i === index ? !value : value));
		const next = { ...entry, enabled };
		update(entry.id, { enabled });
		if (entry.status === "previewing") preview(next);
	};

	return (
		<section
			aria-label="AI Copilot"
			className="panel bg-background flex h-full flex-col overflow-hidden rounded-sm border"
		>
			<header className="flex shrink-0 items-center justify-between gap-2 border-b px-3 py-2">
				<span className="flex items-center gap-2 text-xs font-semibold">
					<Sparkles className="text-primary size-3.5" aria-hidden />
					Copilot
					<span
						className="bg-accent text-muted-foreground rounded-full px-2 py-0.5 text-[0.62rem] font-medium"
						title={
							mode === "claude"
								? "Plans edits with Claude"
								: "No AI key: understands simple commands only"
						}
					>
						{mode === "claude" ? "Claude" : mode === "demo" ? "Demo" : "…"}
					</span>
				</span>
				<Button
					variant="ghost"
					size="icon"
					aria-label="Close Copilot"
					onClick={() => setOpen(false)}
				>
					<X className="size-3.5" />
				</Button>
			</header>

			<div ref={listRef} className="scrollbar-hidden flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3">
				{entries.length === 0 && (
					<p className="text-muted-foreground text-xs leading-relaxed">
						Tell the Copilot what to change. It shows a plan first; nothing changes until you apply it, and one
						Ctrl+Z undoes it. {mode === "demo" && DEMO_HELP}
					</p>
				)}
				{entries.map((entry) => (
					<div key={entry.id} className="flex flex-col gap-2">
						<p className="bg-accent self-end rounded-xl rounded-br-sm px-3 py-1.5 text-xs">{entry.request}</p>
						{entry.status === "thinking" && (
							<p className="text-muted-foreground text-xs" aria-live="polite">
								{entry.progress ?? "Planning…"}
							</p>
						)}
						{entry.status === "error" && (
							<p className="text-destructive text-xs" role="alert">
								{entry.error}
							</p>
						)}
						{entry.plan && (
							<PlanCard
								entry={entry}
								onToggleStep={(index) => toggleStep(entry, index)}
								onPreview={() => (entry.status === "previewing" ? stopPreview() : preview(entry))}
								onApply={() => apply(entry)}
								onDiscard={() => discard(entry)}
							/>
						)}
					</div>
				))}
			</div>

			<form
				className="flex shrink-0 flex-col gap-2 border-t p-2.5"
				onSubmit={(event) => {
					event.preventDefault();
					void send(draft);
				}}
			>
				{mode !== "checking" && (
					<div className="flex flex-wrap gap-1">
						{SUGGESTIONS[mode].map((suggestion) => (
							<button
								key={suggestion}
								type="button"
								onClick={() => void send(suggestion)}
								className="bg-accent text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded-full px-2.5 py-1 text-[0.68rem] font-medium focus-visible:ring-1 focus-visible:outline-none"
							>
								{suggestion}
							</button>
						))}
					</div>
				)}
				<div className="bg-input flex items-end gap-1 rounded-md border px-2 py-1.5">
					<textarea
						aria-label="Ask the Copilot"
						value={draft}
						rows={2}
						placeholder="Ask the Copilot to edit your video…"
						onChange={(event) => setDraft(event.target.value)}
						onKeyDown={(event) => {
							if (event.key === "Enter" && !event.shiftKey) {
								event.preventDefault();
								void send(draft);
							}
						}}
						className="placeholder:text-muted-foreground min-h-0 flex-1 resize-none bg-transparent text-xs outline-none"
					/>
					<Button
						type="submit"
						variant="ghost"
						size="icon"
						aria-label="Send"
						disabled={!draft.trim() || mode === "checking"}
					>
						<SendHorizontal className="size-3.5" />
					</Button>
				</div>
			</form>
		</section>
	);
}

function PlanCard({
	entry,
	onToggleStep,
	onPreview,
	onApply,
	onDiscard,
}: {
	entry: Entry;
	onToggleStep: (index: number) => void;
	onPreview: () => void;
	onApply: () => void;
	onDiscard: () => void;
}) {
	const plan = entry.plan;
	if (!plan) return null;
	const isOpen = entry.status === "ready" || entry.status === "previewing";
	const enabledCount = entry.enabled.filter(Boolean).length;
	return (
		<div className="flex flex-col gap-2">
			<p className="text-xs leading-relaxed">{plan.message}</p>
			{plan.steps.length > 0 && (
				<div className="bg-popover flex flex-col gap-0.5 rounded-md border p-1.5">
					{plan.steps.map((step, index) => {
						const label = describeCopilotStep({ step, clips: entry.clips ?? [] });
						return (
							<label
								key={`${entry.id}-${index}`}
								className={cn(
									"flex items-center gap-2 rounded-sm px-1.5 py-1 text-xs",
									!isOpen && "opacity-60",
								)}
							>
								<Checkbox
									checked={entry.enabled[index] ?? false}
									disabled={!isOpen}
									onCheckedChange={() => onToggleStep(index)}
									aria-label={label}
								/>
								<span className="font-medium">{label}</span>
							</label>
						);
					})}
				</div>
			)}
			{entry.notes.length > 0 && (
				<p className="text-muted-foreground text-[0.68rem]">{entry.notes.join(" ")}</p>
			)}
			{isOpen && plan.steps.length > 0 && (
				<div className="flex flex-wrap items-center gap-1.5">
					<Button size="sm" onClick={onApply} disabled={enabledCount === 0}>
						Apply {enabledCount} {enabledCount === 1 ? "change" : "changes"}
					</Button>
					<Button size="sm" variant="outline" onClick={onPreview} aria-pressed={entry.status === "previewing"} disabled={enabledCount === 0}>
						{entry.status === "previewing" ? "Stop preview" : "Preview"}
					</Button>
					<Button size="sm" variant="ghost" onClick={onDiscard}>
						Discard
					</Button>
				</div>
			)}
			<p className="text-muted-foreground text-[0.68rem]" aria-live="polite">
				{entry.status === "previewing" && "Previewing on the timeline. Apply to keep it, or Discard."}
				{entry.status === "applied" && "Applied as one step. Ctrl+Z undoes it."}
				{entry.status === "discarded" && "Discarded. Nothing changed."}
				{isOpen && entry.status === "ready" && plan.steps.length > 0 && "Applies as one step; Ctrl+Z undoes it."}
			</p>
		</div>
	);
}
