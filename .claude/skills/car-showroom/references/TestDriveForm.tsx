"use client";

/**
 * TestDriveForm — enquiry / book-a-test-drive form -> Supabase.
 * No Stripe (not available in Myanmar). This captures a lead; payment/deposit
 * is handled offline via KBZPay / Wave Money / MMQR shown as contact info.
 *
 *   npm i @supabase/supabase-js
 *
 * lib/supabase.ts:
 *   import { createClient } from "@supabase/supabase-js";
 *   export const supabase = createClient(
 *     process.env.NEXT_PUBLIC_SUPABASE_URL!,
 *     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
 *   );
 *
 * Supabase table (run in SQL editor):
 *   create table test_drive_bookings (
 *     id uuid primary key default gen_random_uuid(),
 *     created_at timestamptz default now(),
 *     name text not null,
 *     phone text not null,         -- Viber/Telegram number in MM
 *     model text,
 *     preferred_date date,
 *     note text
 *   );
 *   alter table test_drive_bookings enable row level security;
 *   create policy "anon insert" on test_drive_bookings
 *     for insert to anon with check (true);
 *   -- reads restricted to your authenticated admin only.
 *
 * NEVER use an HTML <form> element in a React artifact; this uses onClick.
 */

import { useState } from "react";
import { supabase } from "@/lib/supabase";

const MODELS = ["Aurelia GT", "Aurelia Spyder", "Aurelia E"];

export default function TestDriveForm() {
  const [data, setData] = useState({ name: "", phone: "", model: MODELS[0], preferred_date: "", note: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const set = (k: keyof typeof data) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setData((d) => ({ ...d, [k]: e.target.value }));

  const submit = async () => {
    if (!data.name.trim() || !data.phone.trim()) { setStatus("error"); return; }
    setStatus("sending");
    const { error } = await supabase.from("test_drive_bookings").insert({
      name: data.name.trim(),
      phone: data.phone.trim(),
      model: data.model,
      preferred_date: data.preferred_date || null,
      note: data.note.trim() || null,
    });
    setStatus(error ? "error" : "done");
  };

  if (status === "done") {
    return (
      <section className="bg-bg px-6 py-28 text-center">
        <h2 className="font-display text-text" style={{ fontSize: "clamp(1.75rem,4vw,3rem)" }}>
          Thank you
        </h2>
        <p className="mx-auto mt-4 max-w-md text-text-dim">
          We&apos;ve received your request. Our team will contact you on Viber/Telegram shortly.
        </p>
      </section>
    );
  }

  const input = "w-full rounded-lg border border-line bg-bg-elev px-4 py-3 text-text outline-none focus:border-accent transition-colors";

  return (
    <section className="bg-bg px-6 py-28">
      <div className="mx-auto max-w-xl">
        <h2 className="mb-2 font-display text-text" style={{ fontSize: "clamp(1.75rem,4vw,3rem)" }}>
          Book a test drive
        </h2>
        <p className="mb-10 text-text-dim">Leave your details — we&apos;ll reach out to arrange a visit.</p>

        <div className="space-y-4">
          <input className={input} placeholder="Your name" value={data.name} onChange={set("name")} />
          <input className={input} placeholder="Phone (Viber / Telegram)" value={data.phone} onChange={set("phone")} />
          <select className={input} value={data.model} onChange={set("model")}>
            {MODELS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <input className={input} type="date" value={data.preferred_date} onChange={set("preferred_date")} />
          <textarea className={input} rows={3} placeholder="Anything else? (optional)" value={data.note} onChange={set("note")} />

          {status === "error" && (
            <p className="text-sm text-red-400">Please enter at least your name and phone, then try again.</p>
          )}

          <button
            onClick={submit}
            disabled={status === "sending"}
            className="w-full rounded-lg bg-accent px-6 py-3 font-medium text-accent-contrast transition-opacity disabled:opacity-60"
          >
            {status === "sending" ? "Sending…" : "Request test drive"}
          </button>
        </div>

        {/* Payment / deposit info — Myanmar, offline. NOT a checkout. */}
        <div className="mt-10 rounded-lg border border-line bg-bg-elev p-5 text-sm text-text-dim">
          <div className="mb-2 font-medium text-text">Reservation &amp; deposit</div>
          Deposits are arranged after contact via <span className="text-text">KBZPay</span>,{" "}
          <span className="text-text">Wave Money</span>, or <span className="text-text">MMQR</span>.
          International buyers: USDT on request. No online card payment required.
        </div>
      </div>
    </section>
  );
}
