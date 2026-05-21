const KEY = "draftwin_history";
const MAX = 20;

export type ProposalStatus = "sent" | "won" | "lost" | null;

export interface HistoryEntry {
  id: string;
  timestamp: number;
  yourName: string;
  clientName: string;
  skills: string;
  proposal: string;
  status?: ProposalStatus;
  score?: number | null;
}

export function saveToHistory(entry: Omit<HistoryEntry, "id" | "timestamp">): void {
  if (typeof window === "undefined") return;
  const history = getHistory();
  const newEntry: HistoryEntry = { ...entry, id: crypto.randomUUID(), timestamp: Date.now() };
  const updated = [newEntry, ...history].slice(0, MAX);
  localStorage.setItem(KEY, JSON.stringify(updated));
}

export function getHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function deleteFromHistory(id: string): void {
  if (typeof window === "undefined") return;
  const updated = getHistory().filter(e => e.id !== id);
  localStorage.setItem(KEY, JSON.stringify(updated));
}

export function updateHistoryStatus(id: string, status: ProposalStatus): void {
  if (typeof window === "undefined") return;
  const updated = getHistory().map(e => e.id === id ? { ...e, status } : e);
  localStorage.setItem(KEY, JSON.stringify(updated));
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}
