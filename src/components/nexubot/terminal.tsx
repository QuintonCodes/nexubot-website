"use client";

import { Activity } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

type Line = { text: string; tone: "ok" | "info" | "warn" | "accent" };

const script: Line[] = [
  { text: "Initializing Nexubot execution core...", tone: "info" },
  { text: "System status: Operational", tone: "ok" },
  { text: "Connecting to MetaTrader 5 bridge...", tone: "info" },
  { text: "Scanning market structure [EURUSD, XAUUSD]", tone: "accent" },
  { text: "Liquidity sweep detected @ 1.08420", tone: "accent" },
  { text: "Risk parameters: Secure", tone: "ok" },
  { text: "OTE zone confirmed — awaiting displacement", tone: "info" },
  { text: "Loss-streak protection: Armed", tone: "ok" },
  { text: "Order dispatched — TP1 / TP2 / TP3 set", tone: "accent" },
  { text: "Equity guard nominal · Drawdown 4.1%", tone: "warn" },
];

const toneClass: Record<Line["tone"], string> = {
  ok: "text-brand-green",
  info: "text-muted-foreground",
  warn: "text-[#e0a53a]",
  accent: "text-[#3fb4e0]",
};

export function Terminal() {
  const [visible, setVisible] = useState<Line[]>([]);
  const idx = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = script[idx.current % script.length];
      idx.current += 1;
      setVisible((prev) => {
        const arr = [...prev, { ...next, text: next.text }];
        return arr.slice(-7);
      });
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="gradient-border overflow-hidden rounded-2xl shadow-2xl">
      <div className="glass">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-[#ff5f57]" />
            <span className="size-3 rounded-full bg-[#febc2e]" />
            <span className="size-3 rounded-full bg-brand-green" />
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Activity className="size-3.5 text-brand-green" />
            nexubot://live-diagnostic
          </div>
        </div>

        <div className="h-72 space-y-2 p-4 font-mono text-[13px] leading-relaxed sm:h-80">
          <AnimatePresence initial={false}>
            {visible.map((line, i) => (
              <motion.div
                key={`${line.text}-${i}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="flex items-start gap-2"
              >
                <span className="select-none text-brand-green/70">$</span>
                <span className={toneClass[line.tone]}>{line.text}</span>
              </motion.div>
            ))}
          </AnimatePresence>
          <motion.span
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
            className="inline-block h-4 w-2 translate-y-0.5 bg-brand-green"
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
}
