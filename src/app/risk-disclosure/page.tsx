"use client";

import { motion } from "motion/react";

const sections = [
  {
    title: "Loss of capital",
    body: [
      "Trading XAUUSD and derivatives can result in rapid and substantial losses, including loss of all deposited capital. Leverage magnifies both gains and losses. Only risk capital you can afford to lose.",
    ],
  },
  {
    title: "Technology and execution risk",
    body: [
      "Connection failures, VPS downtime, platform errors, slippage, spread expansion, rejected orders, latency, news events, and broker conditions can materially change results or prevent execution.",
    ],
  },
  {
    title: "Performance limitations",
    body: [
      "Backtests, examples, statistics, and past performance are hypothetical or historical and are not guarantees of future results. Live results may differ materially. No statement on this website is financial advice or a recommendation.",
    ],
  },
  {
    title: "Instrument and timeframe",
    body: [
      "Nexubot ICT and Nexubot POI are designed for XAUUSD (Gold) on the M5 chart, using H1 for higher-timeframe bias. Using them on other instruments or timeframes is outside the stated design and may increase risk.",
    ],
  },
];

export default function RiskDisclosurePage() {
  return (
    <section className="mx-auto max-w-4xl px-4 pb-16 pt-32 sm:px-6 lg:pt-40">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-14"
      >
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-brand-green">
          NEXUBOT / RISK
        </p>
        <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
          Risk disclosure
        </h1>
        <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">
          Automated trading involves substantial risk. Read this disclosure
          before purchasing, installing, or enabling any Nexubot Expert Advisor.
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
