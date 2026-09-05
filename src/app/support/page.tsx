"use client";

import { motion } from "motion/react";

const sections = [
  {
    title: "Before activation",
    body: [
      "Use a compatible MetaTrader 5 account, confirm your broker permits automated trading, and test the EA on a demo account before considering live deployment. Only XAUUSD (Gold) on M5 is supported.",
    ],
  },
  {
    title: "Operating checklist",
    body: [
      "Keep your terminal connected, confirm AutoTrading is enabled, use the recommended risk settings, and monitor spread, execution, connectivity, and margin. H1 is used for higher-timeframe bias.",
    ],
  },
  {
    title: "Need help?",
    body: [
      "For account, installation, licensing, or activation questions, visit Contact and include your order reference, EA name, terminal status, and a clear description. Never share passwords, private keys, or broker credentials.",
    ],
  },
];

export default function SupportPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 pb-16 pt-32 sm:px-6 lg:pt-40">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-14"
      >
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-brand-green">
          NEXUBOT / SUPPORT
        </p>
        <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
          A clearer path from setup to execution.
        </h1>
        <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">
          Find the essential operating guidance before you activate an Expert
          Advisor on MetaTrader 5.
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
