"use client";

import {
  Activity,
  ArrowUpRight,
  Bot,
  Crosshair,
  Radio,
  ShieldCheck,
  Waves,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const bars = [
  38, 52, 44, 68, 56, 74, 62, 86, 70, 92, 78, 100, 88, 108, 96, 124, 112, 132,
];
const modes = {
  ict: {
    name: "Nexubot ICT",
    level: "OTE ZONE",
    detail: "61.8% – 78.6% retracement",
    value: "4302.62",
    change: "+2.84%",
    signal: "Continuation bias",
  },
  poi: {
    name: "Nexubot POI",
    level: "LIQUIDITY LEVEL",
    detail: "Buy-side sweep reclaimed",
    value: "4210.40",
    change: "+1.92%",
    signal: "Reversal bias",
  },
};

export function SignalConsole() {
  const [mode, setMode] = useState<"ict" | "poi">("ict");
  const current = modes[mode];
  return (
    <div className="gradient-border glass-panel relative overflow-hidden rounded-2xl p-4 sm:p-5">
      <div className="absolute inset-0 grid-backdrop opacity-60" aria-hidden />
      <div className="relative">
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-green-soft text-brand-green">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <p className="font-heading text-sm font-semibold text-foreground">
                {current.name}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Autonomous execution
              </p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 rounded-full border border-brand-green/20 bg-brand-green-soft px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-brand-green">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-green" />{" "}
            Online
          </span>
        </div>
        <div className="mt-5 flex items-end justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              XAUUSD Gold · M5
            </p>
            <p className="mt-1 font-heading text-3xl font-bold tracking-tight text-foreground">
              {current.level}
            </p>
            <p className="mt-1 font-mono text-[10px] text-brand-blue">
              HTF bias: H1
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[10px] uppercase tracking-wider text-brand-green">
              {current.change}
            </p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              {current.value}
            </p>
          </div>
        </div>
        <div className="relative mt-5 h-44 overflow-hidden rounded-xl border border-border/60 bg-background/50 px-3 pb-3 pt-5">
          <div className="pointer-events-none absolute left-3 right-3 top-1/2 border-t border-dashed border-brand-blue/30" />
          <motion.div
            key={mode}
            className="absolute inset-x-3 bottom-3 top-5 flex items-end gap-1.5"
            initial={{ opacity: 0, x: mode === "ict" ? -16 : 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {bars.map((height, index) => (
              <motion.div
                key={index}
                className="relative flex flex-1 items-end justify-center"
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.7, delay: index * 0.02 }}
              >
                <span
                  className={`w-full max-w-3 rounded-t-sm ${index % 2 ? "bg-brand-green" : "bg-brand-blue/70"}`}
                />
                <span className="absolute bottom-1/2 h-5 w-px bg-brand-blue/70" />
              </motion.div>
            ))}
          </motion.div>
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute left-[67%] top-8 flex -translate-x-1/2 items-center gap-1 rounded bg-brand-green px-2 py-1 font-mono text-[9px] font-bold text-primary-foreground shadow-lg shadow-brand-green/20"
            >
              {current.level} <ArrowUpRight className="h-3 w-3" />
            </motion.div>
          </AnimatePresence>
          <div className="absolute bottom-2 left-3 right-3 flex justify-between font-mono text-[9px] text-muted-foreground/70">
            <span>09:00</span>
            <span>12:00</span>
            <span>15:00</span>
            <span>18:00</span>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            [
              mode === "ict" ? "Entry model" : "Sweep status",
              current.detail,
              mode === "ict" ? Crosshair : Waves,
            ],
            ["Risk mode", "Protected", ShieldCheck],
            ["Latency", "42ms", Activity],
          ].map(([label, value, Icon]) => (
            <div
              key={label as string}
              className="rounded-lg border border-border/50 bg-secondary/40 p-2.5"
            >
              <Icon className="h-3.5 w-3.5 text-brand-blue" />
              <p className="mt-2 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                {label as string}
              </p>
              <p className="mt-0.5 truncate text-xs font-semibold text-foreground">
                {value as string}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/60 pt-3 font-mono text-[10px] text-muted-foreground">
          <Radio className="h-3.5 w-3.5 text-brand-green" />
          <span>{current.signal}</span>
          <div className="ml-auto flex rounded-lg border border-border/60 p-0.5">
            <button
              onClick={() => setMode("ict")}
              className={`cursor-pointer rounded px-2 py-1 text-[9px] ${mode === "ict" ? "bg-brand-green text-primary-foreground" : ""}`}
            >
              ICT
            </button>
            <button
              onClick={() => setMode("poi")}
              className={`cursor-pointer rounded px-2 py-1 text-[9px] ${mode === "poi" ? "bg-brand-green text-primary-foreground" : ""}`}
            >
              POI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
