"use client";

import {
  Activity,
  BarChart3,
  ShieldHalf,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

import { advisorMetrics } from "@/lib/products";

const advisors = [advisorMetrics.ict, advisorMetrics.poi];

function EquityCurve({ curve }: { curve: number[] }) {
  const points = curve
    .map((v, i) => `${(i / (curve.length - 1)) * 100},${100 - v}`)
    .join(" ");

  return (
    <div className="relative h-44 overflow-hidden rounded-xl border border-border/60 bg-background/50 p-4 sm:h-52">
      <div
        className="absolute inset-0 grid grid-cols-4 grid-rows-4 opacity-40"
        aria-hidden
      >
        {Array.from({ length: 16 }).map((_, i) => (
          <span key={i} className="border-b border-r border-border/40" />
        ))}
      </div>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="relative h-full w-full overflow-visible"
      >
        <defs>
          <linearGradient id="curve-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="var(--brand-green)" stopOpacity=".3" />
            <stop offset="1" stopColor="var(--brand-green)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.polygon
          points={`0,100 ${points} 100,100`}
          fill="url(#curve-fill)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        <motion.polyline
          points={points}
          fill="none"
          stroke="var(--brand-green)"
          strokeWidth="1.8"
          strokeLinecap="round"
          pathLength="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute bottom-2 left-4 right-4 flex justify-between font-mono text-[9px] text-muted-foreground">
        <span>JAN 26</span>
        <span>JUN 26</span>
        <span>DEC 26</span>
      </div>
    </div>
  );
}

export function PerformanceMetrics() {
  const [active, setActive] = useState(0);
  const advisor = advisors[active];

  return (
    <section
      id="performance"
      className="motion-grid relative overflow-hidden px-4 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand-green">
            Performance Lab · Historical Backtest Data
          </span>
          <h2 className="mt-3 text-balance font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
            Two systems. One focused market.
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Compare the live-ready performance profile of each Nexubot Systems
            Expert Advisor, built exclusively for XAUUSD Gold on the M5 chart
            with H1 higher-timeframe bias.
          </p>
        </motion.div>
        <div
          className="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-2"
          role="tablist"
          aria-label="Nexubot Systems Expert Advisors"
        >
          {advisors.map((item, i) => (
            <button
              key={item.name}
              role="tab"
              aria-selected={active === i}
              onClick={() => setActive(i)}
              className={`cursor-pointer group flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all duration-300 ${active === i ? "border-brand-green/50 bg-brand-green-soft shadow-[0_0_24px_-12px_rgba(3,201,99,.7)]" : "border-border bg-card/50 hover:border-brand-blue/40"}`}
            >
              <span>
                <span className="block font-heading text-sm font-bold">
                  {item.name}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  XAUUSD Gold · M5 / H1 bias
                </span>
              </span>
              <span className="font-mono text-xs font-bold text-brand-green">
                {item.roi}
              </span>
            </button>
          ))}
        </div>
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-border glass-panel rounded-2xl p-4 sm:p-6"
        >
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-brand-green" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-brand-green">
                  Strategy Tester Report
                </span>
              </div>
              <h3 className="mt-2 font-heading text-2xl font-extrabold">
                {advisor.name}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  / {advisor.subtitle}
                </span>
              </h3>
            </div>
            <span className="rounded-lg border border-border px-3 py-2 font-mono text-xs text-muted-foreground">
              12M backtest
            </span>
          </div>
          <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <div className="rounded-xl border border-border/60 bg-secondary/20 p-3 sm:p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <TrendingUp className="h-4 w-4 text-brand-green" />
                  Equity curve
                </span>
                <span className="font-mono text-xs text-brand-green">
                  {advisor.roi} net
                </span>
              </div>
              <EquityCurve curve={advisor.curve} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: "Profit Factor",
                  value: advisor.profit,
                  Icon: TrendingUp,
                  color: "text-brand-green",
                },
                {
                  label: "Win rate",
                  value: `${advisor.win}%`,
                  Icon: Trophy,
                  color: "text-brand-green",
                },
                {
                  label: "Max drawdown",
                  value: advisor.dd,
                  Icon: ShieldHalf,
                  color: "text-brand-blue",
                },
                {
                  label: "Total trades",
                  value: advisor.trades,
                  Icon: Activity,
                  color: "text-foreground",
                },
              ].map(({ label, value, Icon, color }) => (
                <motion.div
                  whileHover={{ y: -3 }}
                  key={label as string}
                  className="rounded-xl border border-border/60 bg-secondary/20 p-4 transition-colors hover:border-brand-blue/40"
                >
                  <Icon className={`h-4 w-4 ${color}`} />
                  <p className="mt-4 text-xs text-muted-foreground">
                    {label as string}
                  </p>
                  <p
                    className={`mt-1 font-heading text-xl font-extrabold ${color}`}
                  >
                    {value as string}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="mt-5 flex items-center gap-2 border-t border-border/60 pt-4 text-xs text-muted-foreground">
            <BarChart3 className="h-4 w-4 text-brand-blue" />
            Stats shown for Nexubot ICT and Nexubot POI only
            <span className="ml-auto hidden font-mono text-[10px] text-brand-green sm:block">
              REPORT ID: NEXU-{active + 1}042
            </span>
          </div>
          <p className="mt-5 text-[10px] italic leading-tight text-muted-foreground/80">
            * Based on historical simulated backtesting. Hypothetical or
            simulated performance results have certain inherent limitations and
            do not guarantee future live trading results.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
