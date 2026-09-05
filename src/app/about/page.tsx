"use client";

import { motion } from "motion/react";

const sections = [
  {
    title: "What we build",
    body: [
      "Nexubot ICT and Nexubot POI are software tools for automated trading. They are designed around market structure, higher-timeframe bias, disciplined entries, and protective trade management.",
    ],
  },
  {
    title: "Built for clarity",
    body: [
      "Every product is documented around its intended instrument, timeframe, and operating assumptions. H1 provides the higher-timeframe bias while M5 is used for execution on XAUUSD only.",
    ],
  },
  {
    title: "What we do not provide",
    body: [
      "Nexubot is not a broker, investment manager, portfolio manager, or financial adviser. Purchasing software does not guarantee profits, and users remain responsible for their account, broker, settings, and decisions.",
    ],
  },
];

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 pb-16 pt-32 sm:px-6 lg:pt-40">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-14"
      >
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-brand-green">
          NEXUBOT / ABOUT
        </p>
        <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
          Automation with a risk-aware edge.
        </h1>
        <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">
          Nexubot builds focused MetaTrader 5 Expert Advisors for XAUUSD (Gold)
          on the M5 chart. Our systems turn structured market logic into
          repeatable execution without promising certainty.
        </p>
      </motion.div>
      <div className="space-y-10">
        {sections.map((section, index) => (
          <motion.section
            key={section.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: index * 0.04 }}
            className="glass-panel rounded-2xl p-6 sm:p-8"
          >
            <h2 className="text-xl font-semibold">{section.title}</h2>
            <div className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </motion.section>
        ))}
      </div>
    </section>
  );
}
