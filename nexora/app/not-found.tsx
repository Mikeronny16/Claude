import Link from "next/link";
import { LogoMark } from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70dvh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="animate-float">
        <LogoMark size={72} />
      </div>
      <h1 className="font-display text-2xl">This island drifted away</h1>
      <p className="text-dim">We couldn&apos;t find that page.</p>
      <Link href="/world" className="btn btn-gold">
        Back to my world
      </Link>
    </div>
  );
}
