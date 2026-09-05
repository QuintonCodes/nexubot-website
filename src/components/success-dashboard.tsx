"use client";

import {
  Activity,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import { toast } from "sonner";

import type { Product } from "@/lib/products";
import { metrics } from "@/lib/products";

const LICENSE_KEY = "NEXU-1Z45-7F42-A91C-38DE";

export function SuccessDashboard({ product }: { product: Product }) {
  async function copyLicenseKey() {
    await navigator.clipboard.writeText(LICENSE_KEY);
    toast.success("License key copied to clipboard");
  }

  const cards = [
    ["ROI", metrics.roi],
    ["Win rate", `${metrics.winRate}%`],
    ["Profit Factor", metrics.profitFactor],
    ["Max drawdown", metrics.maxDrawdownPct],
  ];

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 border-b border-border pb-6">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-green/30 bg-brand-green-soft px-3 py-1.5 text-xs font-semibold text-brand-green">
            <CheckCircle2 className="h-3.5 w-3.5" /> Payment confirmed
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Your Nexubot is ready.
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Save your license key before leaving this page.
          </p>
        </div>
        <div className="grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
          <section className="space-y-5">
            <div className="glass-panel rounded-2xl p-5 sm:p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-brand-green">
                    License activation
                  </p>
                  <h2 className="mt-1 text-lg font-semibold">
                    {product.name} Enterprise
                  </h2>
                </div>
                <ShieldCheck className="h-5 w-5 text-brand-green" />
              </div>
              <div className="flex items-center justify-between rounded-xl border border-brand-green/20 bg-secondary/60 p-4 font-mono text-sm">
                {LICENSE_KEY}
                <button
                  aria-label="Copy license key"
                  onClick={copyLicenseKey}
                  className="cursor-pointer text-muted-foreground hover:text-brand-green"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="mt-1 font-semibold text-brand-green">Active</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Plan</p>
                  <p className="mt-1 font-semibold">Lifetime</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Seats</p>
                  <p className="mt-1 font-semibold">1 account</p>
                </div>
              </div>
            </div>
            <div className="glass-panel rounded-2xl p-5 sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <Terminal className="h-5 w-5 text-brand-green" />
                <div>
                  <h2 className="font-semibold">Installation guide</h2>
                  <p className="text-sm text-muted-foreground">
                    Deploy in three steps
                  </p>
                </div>
              </div>
              <ol className="space-y-4 text-sm leading-6">
                <li>
                  <span className="mr-3 font-mono text-brand-green">01</span>
                  Download the EA package and open MetaTrader 5.
                </li>
                <li>
                  <span className="mr-3 font-mono text-brand-green">02</span>
                  Copy the file into{" "}
                  <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs">
                    MQL5/Experts
                  </code>
                  .
                </li>
                <li>
                  <span className="mr-3 font-mono text-brand-green">03</span>
                  Paste your key into the Nexubot settings panel.
                </li>
              </ol>
            </div>
          </section>
          <aside className="space-y-5">
            <div className="glass-panel rounded-2xl p-5 sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <Activity className="h-5 w-5 text-brand-green" />
                <h2 className="font-semibold">Verified performance</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {cards.map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-secondary/60 p-3">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="mt-1 text-lg font-semibold text-brand-green">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-brand-green/20 bg-brand-green-soft p-5">
              <h2 className="font-semibold">Need help deploying?</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Our technical team can help you get your first chart live.
              </p>
              <button className="cursor-pointer mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-green">
                Contact support <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
            <button className="cursor-pointer inline-flex items-center gap-2 text-sm font-semibold text-brand-green">
              <Download className="h-4 w-4" /> Download package
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}
