"use client";

import type { LucideIcon } from "lucide-react";
import { CreditCard, KeyRound, MonitorCheck } from "lucide-react";
import { motion } from "motion/react";

const steps: { icon: LucideIcon; step: string; title: string; body: string }[] =
  [
    {
      icon: CreditCard,
      step: "01",
      title: "Instant Checkout",
      body: "Complete a secure purchase via our encrypted gateway. Payment is verified against our database in real time.",
    },
    {
      icon: KeyRound,
      step: "02",
      title: "Unique Key Generation",
      body: "A cryptographic, hardware-locking access key is generated instantly and bound to your license record.",
    },
    {
      icon: MonitorCheck,
      step: "03",
      title: "MT5 Terminal Activation",
      body: "Drop the binary into MetaTrader 5, enter your key, and the algorithm authenticates and goes live.",
    },
  ];

export function Licensing() {
  return (
    <section id="licensing" className="relative px-4 py-20 sm:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 mx-auto h-64 max-w-4xl -translate-y-1/2 rounded-full bg-brand-blue/8 blur-[120px]"
      />
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue">
            Licensing & Infrastructure
          </span>
          <h2 className="mt-3 text-balance font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
            A Database-Verified Access Key System
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            From checkout to live execution in three verifiable steps — no
            manual approvals, no waiting.
          </p>
        </div>

        <div className="relative grid gap-6 md:grid-cols-3">
          {/* connective line */}
          <div
            aria-hidden
            className="absolute left-0 right-0 top-16 hidden h-px bg-linear-to-r from-brand-green/40 via-brand-blue/40 to-brand-green/40 md:block"
          />
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.55,
                  delay: i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="gradient-border glass-panel relative rounded-2xl p-6 transition-shadow duration-500 hover:shadow-[0_18px_50px_-24px_rgba(42,155,199,.65)]"
              >
                <div className="flex items-center justify-between">
                  <span className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-brand-blue/30 bg-brand-blue-soft">
                    <Icon className="h-5 w-5 text-brand-blue" />
                  </span>
                  <span className="font-heading text-3xl font-extrabold text-border">
                    {s.step}
                  </span>
                </div>
                <h3 className="mt-5 font-heading text-lg font-bold">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
