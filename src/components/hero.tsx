"use client";

import { ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { type Variants, motion } from "motion/react";

import { SignalConsole } from "./signal-console";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function Hero() {
  return (
    <section
      id="top"
      className="motion-grid relative overflow-hidden px-4 pt-32 pb-16 sm:pt-40 sm:pb-24"
    >
      {/* decorative glow accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-brand-green/10 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-24 right-0 h-96 w-96 rounded-full bg-brand-blue/10 blur-[130px]"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div>
          <motion.span
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-medium text-muted-foreground"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-brand-green" />
            Institutional-grade automation
          </motion.span>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-5 text-balance font-heading text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
          >
            Next-Generation{" "}
            <span className="text-brand-green text-glow-green">
              Algorithmic
            </span>{" "}
            Automation.
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Nexubot Systems deploys institutional-grade Expert Advisors directly
            onto MetaTrader 5 — engineered exclusively for XAUUSD Gold on the M5
            chart with H1 higher-timeframe bias, adaptive risk management, and
            verified backtested performance.
          </motion.p>

          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <a
              href="#algorithms"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-brand-green px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_10px_30px_-8px_rgba(3,201,99,0.6)] transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              Explore Systems
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#performance"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary/40 px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              View Performance
            </a>
          </motion.div>

          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground"
          >
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-brand-blue" />
              Database-verified licensing
            </span>
            <span className="inline-flex items-center gap-2">
              <Zap className="h-4 w-4 text-brand-green" />
              24/7 VPS execution
            </span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <SignalConsole />
        </motion.div>
      </div>
    </section>
  );
}
