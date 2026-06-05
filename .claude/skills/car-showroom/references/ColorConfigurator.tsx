"use client";

/**
 * ColorConfigurator — swatches that swap the displayed car.
 * Simplest reliable version: each color has its own poster image; clicking a
 * swatch cross-fades to it (Framer Motion). For a per-color animated sequence,
 * point each color at its own /sequence/<color> folder and mount the matching
 * <ScrollImageSequence>.
 *
 *   npm i framer-motion
 */

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Color = { name: string; hex: string; poster: string };

const DEFAULT_COLORS: Color[] = [
  { name: "Obsidian", hex: "#0c0c0d", poster: "/posters/obsidian.webp" },
  { name: "Champagne", hex: "#cbb990", poster: "/posters/champagne.webp" },
  { name: "Viridian", hex: "#1f4d3f", poster: "/posters/viridian.webp" },
  { name: "Crimson", hex: "#6e1414", poster: "/posters/crimson.webp" },
];

export default function ColorConfigurator({ colors = DEFAULT_COLORS }: { colors?: Color[] }) {
  const [active, setActive] = useState(0);
  const color = colors[active];

  return (
    <section className="bg-bg px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-10 font-display text-text"
            style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)" }}>
          Make it yours
        </h2>

        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-line bg-bg-elev">
          <AnimatePresence mode="wait">
            <motion.img
              key={color.name}
              src={color.poster}
              alt={`${color.name} finish`}
              className="h-full w-full object-cover"
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </AnimatePresence>
        </div>

        <div className="mt-8 flex items-center gap-4">
          {colors.map((c, i) => {
            const isActive = i === active;
            return (
              <button
                key={c.name}
                onClick={() => setActive(i)}
                aria-label={c.name}
                aria-pressed={isActive}
                className="relative h-9 w-9 rounded-full transition-transform"
                style={{
                  background: c.hex,
                  boxShadow: isActive
                    ? "0 0 0 2px var(--bg), 0 0 0 4px var(--accent)"
                    : "0 0 0 1px var(--line)",
                  transform: isActive ? "scale(1.1)" : "scale(1)",
                }}
              />
            );
          })}
          <span className="ml-2 text-sm text-text-dim">{color.name}</span>
        </div>
      </div>
    </section>
  );
}
