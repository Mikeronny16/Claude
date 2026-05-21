# New Page Command

When Mike asks to create a new page, use this Ocean Dark template:

```tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const a = "#06b6d4";

export default function PageName() {
  return (
    <main className="min-h-screen px-4 py-8 max-w-xl mx-auto">
      {/* Floating background orb */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)", animation: "float-slow 9s ease-in-out infinite" }} />
      </div>

      <div className="relative z-10 animate-slide-up">
        <h1 className="text-2xl font-extrabold" style={{ color: "var(--text)" }}>Title</h1>
        
        {/* Glass card */}
        <div className="glass p-6 mt-6">
          {/* content */}
        </div>
      </div>
    </main>
  );
}
```

Always:
- Mobile-first (max-w-xl mx-auto)
- Ocean dark colors
- Plus Jakarta Sans (inherited from layout)
- Glass morphism cards
- Floating orb background
