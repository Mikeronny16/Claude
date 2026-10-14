"use client";

import { Info, Sparkles, TriangleAlert, Check, X } from "lucide-react";
import { useEffect } from "react";
import { useNexora, type Toast } from "@/lib/store";

const ICONS = { info: Info, success: Check, xp: Sparkles, warn: TriangleAlert } as const;

function ToastItem({ toast }: { toast: Toast }) {
  const dismiss = useNexora((s) => s.dismissToast);
  useEffect(() => {
    const t = setTimeout(() => dismiss(toast.id), toast.tone === "warn" ? 6500 : 4500);
    return () => clearTimeout(t);
  }, [toast.id, toast.tone, dismiss]);
  const Icon = ICONS[toast.tone];
  return (
    <li
      className={`panel toast-surface animate-rise pointer-events-auto flex items-start gap-3 p-3 pr-2 shadow-xl ${
        toast.tone === "xp" ? "border-amber-300/50" : toast.tone === "warn" ? "border-rose-300/40" : ""
      }`}
    >
      <span
        className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-full ${
          toast.tone === "xp" ? "bg-amber-300/20 text-amber-200" : toast.tone === "warn" ? "bg-rose-300/15 text-rose-200" : "bg-cyan-300/15 text-cyan-200"
        }`}
      >
        <Icon size={16} aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-bold ${toast.tone === "xp" ? "text-amber-200" : ""}`}>{toast.title}</p>
        {toast.body && <p className="text-sm text-dim">{toast.body}</p>}
      </div>
      <button type="button" className="icon-btn size-9! border-0 bg-transparent" onClick={() => dismiss(toast.id)} aria-label="Dismiss notification">
        <X size={16} aria-hidden />
      </button>
    </li>
  );
}

export function Toasts() {
  const toasts = useNexora((s) => s.toasts);
  return (
    <div aria-live="polite" aria-atomic="false" className="pointer-events-none fixed inset-x-0 top-[calc(var(--top-h)+0.5rem)] z-50 flex justify-center px-4 lg:top-4 lg:justify-end">
      <ul className="flex w-full max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} />
        ))}
      </ul>
    </div>
  );
}
