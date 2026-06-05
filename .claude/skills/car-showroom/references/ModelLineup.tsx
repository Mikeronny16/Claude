"use client";

/**
 * ModelLineup — grid of available models. Hover lifts the card and reveals a
 * "View" affordance; click routes to /models/[slug] (reuse the hero pattern
 * per model). Framer Motion for the hover micro-interaction.
 *
 *   npm i framer-motion
 */

import Link from "next/link";
import { motion } from "framer-motion";

type Model = {
  slug: string;
  name: string;
  tagline: string;
  price: string;     // already formatted, e.g. "from 250,000,000 MMK"
  image: string;
};

const DEFAULT_MODELS: Model[] = [
  { slug: "gt",     name: "Aurelia GT",     tagline: "Grand tourer",     price: "from 250,000,000 MMK", image: "/models/gt.webp" },
  { slug: "spyder", name: "Aurelia Spyder", tagline: "Open top",         price: "from 320,000,000 MMK", image: "/models/spyder.webp" },
  { slug: "ev",     name: "Aurelia E",      tagline: "Fully electric",   price: "from 210,000,000 MMK", image: "/models/ev.webp" },
];

export default function ModelLineup({ models = DEFAULT_MODELS }: { models?: Model[] }) {
  return (
    <section className="bg-bg px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-12 font-display text-text"
            style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)" }}>
          The lineup
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {models.map((m) => (
            <Link key={m.slug} href={`/models/${m.slug}`} className="group block">
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="overflow-hidden rounded-xl border border-line bg-bg-elev"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={m.image}
                    alt={m.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-end justify-between p-5">
                  <div>
                    <div className="font-display text-xl text-text">{m.name}</div>
                    <div className="text-sm text-text-dim">{m.tagline}</div>
                    <div className="mt-2 text-xs uppercase tracking-widest text-text-dim">
                      {m.price}
                    </div>
                  </div>
                  <span className="text-sm text-accent opacity-0 transition-opacity group-hover:opacity-100">
                    View →
                  </span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
