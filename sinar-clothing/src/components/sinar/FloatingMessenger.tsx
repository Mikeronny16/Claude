import { MessageCircle } from "lucide-react";
import { LINKS } from "@/lib/sinar-links";

export function FloatingMessenger() {
  return (
    <a href={LINKS.messenger} target="_blank" rel="noopener noreferrer" aria-label="Chat on Messenger"
      className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-50 group">
      <span className="absolute inset-0 rounded-full bg-deep animate-pulse-soft" />
      <span className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-deep hover:bg-deep-hover text-white flex items-center justify-center shadow-soft transition-transform group-hover:scale-105">
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2} />
      </span>
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-white text-ink text-xs font-medium px-3 py-2 rounded-full shadow-card border border-hairline opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
        <span className="font-mm">Messenger မှာ စုံစမ်းရန်</span>
      </span>
    </a>
  );
}
