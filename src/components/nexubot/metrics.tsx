"use client";

import { Layers, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

import { metrics } from "@/lib/products";
import { cn } from "@/lib/utils";
import { WinRateDial } from "./win-rate-dial";

const accentText: Record<string, string> = {
  green: "text-brand-green",
  blue: "text-[#3fb4e0]",
  neutral: "text-foreground",
};

export function Metrics() {
  return (
    <section id="performance" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-sm font-semibold uppercase tracking-widest text-brand-green"
          >
            Verified Performance
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-3 font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl"
          >
            Backtested results that hold under pressure
          </motion.h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            A transparent 12-month simulation on live-market data. Every
            execution is logged, every drawdown accounted for.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="gradient-border-hover group rounded-2xl p-6"
            >
              <div className="flex items-start justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  {m.label}
                </p>
                {m.label === "Total Net Profit" && (
                  <TrendingUp className="size-5 text-brand-green" />
                )}
                {m.label === "Total Trades" && (
                  <Layers className="size-5 text-muted-foreground" />
                )}
                {m.label === "Win Rate" && <WinRateDial percent={77.31} />}
              </div>

              <p
                className={cn(
                  "mt-4 font-heading text-4xl font-extrabold tracking-tight",
                  accentText[m.accent ?? "neutral"],
                )}
              >
                {m.value}
              </p>
              {m.sub && (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {m.sub}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
