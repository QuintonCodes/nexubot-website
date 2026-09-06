"use client";

import { motion } from "motion/react";

const sections = [
  {
    title: "Software licence",
    body: [
      "Nexubot Systems grants a limited, non-exclusive, non-transferable licence to use the purchased EA for its intended purpose. You may not resell, redistribute, reverse engineer, copy, or circumvent licence controls.",
    ],
  },
  {
    title: "User responsibility",
    body: [
      "You are responsible for your trading account, broker relationship, internet connection, VPS, configuration, tax obligations, and compliance with applicable law. You must evaluate whether automated trading is suitable for you.",
    ],
  },
  {
    title: "No guarantee",
    body: [
      "Software performance can be affected by markets, spreads, slippage, latency, outages, broker execution, and settings. No result, return, uptime, or compatibility guarantee is made.",
    ],
  },
  {
    title: "Purchases and updates",
    body: [
      "Prices, product availability, licensing limits, and update policies are displayed at checkout. Digital products may be subject to applicable consumer-law exceptions once delivery or activation begins.",
    ],
  },
];

export default function TermsPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 pb-16 pt-32 sm:px-6 lg:pt-40">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-14"
      >
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-brand-green">
          NEXUBOT SYSTEMS / TERMS
        </p>
        <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
          Terms of use
        </h1>
        <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">
          These terms govern access to Nexubot Systems software and website
          services. By purchasing or using an EA, you acknowledge these terms.
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
