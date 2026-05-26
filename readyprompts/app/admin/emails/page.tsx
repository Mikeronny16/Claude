"use client";

import { useState } from "react";

const EMAILS = [
  {
    id: "welcome",
    label: "Email 1 — Welcome & Delivery",
    timing: "Send immediately after payment confirmed",
    subject: "✅ Your ReadyPrompts are ready — download link inside",
    body: `Hi [NAME],

Thank you so much for your purchase! 🎉

Your 120 AI prompts are ready. Here's your download link:

👉 https://readyprompts.vercel.app/thank-you

---

What's inside your kit:
• 20 TikTok & Short Video prompts
• 18 Instagram Content prompts
• 20 Marketing & Sales prompts
• 18 Business & Money prompts
• 12 Email Marketing prompts
• 17 Personal Brand prompts

---

Quick tip to get started: Open ChatGPT (or Claude, Gemini — whichever you use), paste any prompt, and replace the [BRACKETS] with your specific info. The results will surprise you.

Questions? Just reply to this email.

— Mike
ReadyPrompts | readyprompts.vercel.app`,
  },
  {
    id: "day1",
    label: "Email 2 — Day 1 Pro Tips",
    timing: "Send ~24 hours after delivery",
    subject: "The 3 prompts most people use first (+ a pro tip)",
    body: `Hi [NAME],

Just checking in — have you tried your prompts yet?

If you're not sure where to start, here are the 3 most popular ones from buyers:

1. **TikTok Hook Generator** (Prompt #1)
   → Great if you make videos or content

2. **AIDA Copywriter** (Marketing section)
   → Perfect for writing any sales message

3. **Origin Story Creator** (Personal Brand section)
   → Use this to write your bio or About page

---

Pro tip: The prompts work better when you give the AI context about YOU.

Instead of just pasting the prompt, add one line before it:

"I'm a [your job/niche] targeting [your audience]. " + [paste prompt]

This alone will double the quality of your results.

---

Still have questions about how to use them? Just reply — I read every email.

— Mike
ReadyPrompts`,
  },
  {
    id: "day3",
    label: "Email 3 — Day 3 Re-engagement",
    timing: "Send ~3 days after delivery",
    subject: "Did this prompt work for you? (honest question)",
    body: `Hi [NAME],

Quick question — have you used any of the prompts yet?

If yes: I'd love to hear which one worked best. Just reply and tell me. It helps me improve the kit.

If not yet: totally normal. Life gets busy.

Here's a 60-second challenge for today:

1. Open ChatGPT (or any AI)
2. Go to the "Personal Brand" section in your prompts file
3. Find "Origin Story Creator"
4. Paste it in and replace [YOUR NICHE] with what you do

Takes 2 minutes. You'll have a ready-to-post bio or intro.

---

Also — if you found the kit valuable, the best thing you can do is share it with one person who could use it. Your referral link gives them 5 free prompts instead of 3:

👉 https://readyprompts.vercel.app/?ref=[THEIR_REF_CODE]

(Replace [THEIR_REF_CODE] with their name or email — I'll track it manually)

Thanks again for your support. It genuinely means a lot.

— Mike
ReadyPrompts | readyprompts.vercel.app

P.S. If you want a refund for any reason, just reply. No questions asked.`,
  },
];

export default function EmailSequencePage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <main className="min-h-screen bg-cinema-bg px-5 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <a href="/admin" className="text-xs font-semibold" style={{ color: "#64748b" }}>← Admin Panel</a>
          <h1 className="text-2xl font-black text-white mt-2">Email Sequence Templates</h1>
          <p className="text-sm mt-1" style={{ color: "#64748b" }}>
            Copy these and send manually via Gmail after each payment is approved.
          </p>
        </div>

        <div className="space-y-8">
          {EMAILS.map((email) => (
            <div key={email.id} className="rounded-2xl overflow-hidden"
              style={{ background: "rgba(10,15,26,0.9)", border: "1px solid rgba(30,41,59,0.6)" }}>
              <div className="px-5 py-4 flex items-center justify-between"
                style={{ borderBottom: "1px solid rgba(30,41,59,0.6)" }}>
                <div>
                  <p className="font-black text-white text-sm">{email.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#f97316" }}>{email.timing}</p>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* Subject */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#64748b" }}>Subject Line</p>
                    <button
                      onClick={() => copy(`${email.id}-subject`, email.subject)}
                      className="text-xs px-2.5 py-1 rounded-lg font-semibold"
                      style={{
                        background: copied === `${email.id}-subject` ? "rgba(34,197,94,0.15)" : "rgba(249,115,22,0.1)",
                        color: copied === `${email.id}-subject` ? "#4ade80" : "#f97316",
                        border: `1px solid ${copied === `${email.id}-subject` ? "rgba(34,197,94,0.3)" : "rgba(249,115,22,0.2)"}`,
                      }}>
                      {copied === `${email.id}-subject` ? "✓ Copied" : "Copy"}
                    </button>
                  </div>
                  <div className="px-4 py-3 rounded-xl text-sm font-semibold text-white"
                    style={{ background: "rgba(15,20,30,0.9)", border: "1px solid rgba(30,41,59,0.8)" }}>
                    {email.subject}
                  </div>
                </div>

                {/* Body */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#64748b" }}>Email Body</p>
                    <button
                      onClick={() => copy(`${email.id}-body`, email.body)}
                      className="text-xs px-2.5 py-1 rounded-lg font-semibold"
                      style={{
                        background: copied === `${email.id}-body` ? "rgba(34,197,94,0.15)" : "rgba(249,115,22,0.1)",
                        color: copied === `${email.id}-body` ? "#4ade80" : "#f97316",
                        border: `1px solid ${copied === `${email.id}-body` ? "rgba(34,197,94,0.3)" : "rgba(249,115,22,0.2)"}`,
                      }}>
                      {copied === `${email.id}-body` ? "✓ Copied" : "Copy"}
                    </button>
                  </div>
                  <pre className="px-4 py-3 rounded-xl text-xs leading-relaxed whitespace-pre-wrap overflow-x-auto"
                    style={{
                      background: "rgba(15,20,30,0.9)",
                      border: "1px solid rgba(30,41,59,0.8)",
                      color: "#94a3b8",
                      fontFamily: "monospace",
                    }}>
                    {email.body}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 rounded-xl text-sm" style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)", color: "#94a3b8" }}>
          <strong className="text-white">Checklist for each payment:</strong>
          <ol className="mt-2 space-y-1 list-decimal list-inside">
            <li>Approve payment in admin panel → send download link</li>
            <li>Send Email 1 (Welcome) immediately</li>
            <li>Set a reminder → send Email 2 next day</li>
            <li>Set a reminder → send Email 3 on day 3</li>
            <li>Replace [NAME] in every email before sending</li>
          </ol>
        </div>
      </div>
    </main>
  );
}
