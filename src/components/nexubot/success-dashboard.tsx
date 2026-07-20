"use client";

import type { Product } from "@/lib/products";
import {
  Check,
  CheckCircle2,
  Copy,
  Download,
  FileArchive,
  FileText,
  FolderInput,
  KeyRound,
  Mail,
  Server,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

function generateKey() {
  const seg = () =>
    Math.random().toString(36).slice(2, 6).toUpperCase().padEnd(4, "X");
  return `NEXU-${seg()}-${seg()}-${seg()}-${seg()}`;
}

const downloads = [
  {
    icon: FileArchive,
    name: "Nexubot_ICT.ex5",
    meta: "Compiled Expert Advisor · 1.2 MB",
    tint: "text-brand-green",
    ring: "border-brand-green/30 bg-brand-green/10",
  },
  {
    icon: FileText,
    name: "Nexubot_Setup_Guide.pdf",
    meta: "Onboarding Manual · 3.8 MB",
    tint: "text-[#3fb4e0]",
    ring: "border-[#3fb4e0]/30 bg-[#3fb4e0]/10",
  },
];

const nextSteps = [
  {
    icon: Download,
    title: "Download the EA and manual",
    body: "Extract the secure bundle to your setup machine (Windows PC/Laptop or Mac with Windows virtualization).",
  },
  {
    icon: Server,
    title: "Log into your Windows VPS",
    body: "Connect to your 24/7 Windows Server VPS environment where the terminal will run uninterrupted.",
  },
  {
    icon: FolderInput,
    title: "Deploy to MetaTrader 5",
    body: "Place Nexubot_ICT.ex5 in the MetaTrader 5 Experts folder and enter your Access Key to activate.",
  },
];

export function SuccessDashboard({
  product,
  email,
}: {
  product: Product;
  email: string;
}) {
  const licenseKey = useMemo(() => generateKey(), []);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(licenseKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="p-6 sm:p-8">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 16 }}
        className="mx-auto flex size-16 items-center justify-center rounded-full border border-brand-green/40 bg-brand-green/10"
      >
        <CheckCircle2 className="size-9 text-brand-green" />
      </motion.div>

      <div className="mt-5 text-center">
        <h3 className="font-heading text-2xl font-bold tracking-tight">
          Payment Successful
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Your {product.name} license is active. A backup of this bundle has
          been dispatched to{" "}
          <span className="font-medium text-foreground">
            {email || "your billing email"}
          </span>{" "}
          via our automated servers.
        </p>
      </div>

      {/* Delivery bundle */}
      <div className="mt-8">
        <div className="flex items-center gap-2">
          <FileArchive className="size-4 text-muted-foreground" />
          <p className="text-sm font-semibold">Secure Delivery Bundle</p>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3">
          {downloads.map((d, i) => (
            <motion.div
              key={d.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.1 }}
              className="gradient-border-hover flex items-center gap-3 rounded-xl p-4"
            >
              <div
                className={`flex size-11 items-center justify-center rounded-lg border ${d.ring}`}
              >
                <d.icon className={`size-5 ${d.tint}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{d.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {d.meta}
                </p>
              </div>
              <button
                type="button"
                className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary text-foreground transition-colors hover:bg-secondary/70"
                aria-label={`Download ${d.name}`}
              >
                <Download className="size-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* License key */}
      <div className="mt-6">
        <div className="flex items-center gap-2">
          <KeyRound className="size-4 text-muted-foreground" />
          <p className="text-sm font-semibold">Cryptographic License Key</p>
        </div>
        <div className="mt-3 flex items-center gap-3 rounded-xl border border-brand-green/30 bg-brand-green/5 p-4">
          <code className="flex-1 truncate font-mono text-sm tracking-wide text-brand-green sm:text-base">
            {licenseKey}
          </code>
          <button
            type="button"
            onClick={copy}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-transform hover:scale-105 active:scale-95"
          >
            {copied ? (
              <Check className="size-3.5" />
            ) : (
              <Copy className="size-3.5" />
            )}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <KeyRound className="size-3" />
          Hardware-locking. Bind this key to a single terminal.
        </p>
      </div>

      {/* Next steps */}
      <div className="mt-8">
        <p className="text-sm font-semibold">Next Steps</p>
        <ol className="mt-4 space-y-4">
          {nextSteps.map((s, i) => (
            <li key={s.title} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex size-9 items-center justify-center rounded-full border border-border bg-secondary text-sm font-bold text-brand-green">
                  {i + 1}
                </div>
                {i < nextSteps.length - 1 && (
                  <span className="mt-1 h-full w-px flex-1 bg-border" />
                )}
              </div>
              <div className="pb-2">
                <p className="flex items-center gap-2 text-sm font-medium">
                  <s.icon className="size-4 text-brand-green" />
                  {s.title}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 rounded-lg border border-border bg-secondary/40 px-4 py-3 text-xs text-muted-foreground">
        <Mail className="size-3.5" />
        Receipt and key backup sent to your billing email.
      </div>
    </div>
  );
}
