"use client";

import { ArrowRight, CreditCard, KeyRound, MonitorCheck } from "lucide-react";
import { motion } from "motion/react";

const steps = [
  {
    icon: CreditCard,
    step: "01",
    title: "Instant Checkout",
    body: "Complete a secure payment through our gateway. Your order is registered against the licensing database the moment it clears.",
  },
  {
    icon: KeyRound,
    step: "02",
    title: "Unique Key Generation",
    body: "A cryptographic, hardware-locking access key is generated and bound to your account — verifiable server-side on every launch.",
  },
  {
    icon: MonitorCheck,
    step: "03",
    title: "MetaTrader 5 Activation",
    body: "Drop the expert advisor into your terminal, enter your key, and the system authenticates and goes live within seconds.",
  },
];

export function Licensing() {
  return (
    <section id="licensing" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-sm font-semibold uppercase tracking-widest text-brand-green"
          >
            Licensing &amp; Infrastructure
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-3 font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl"
          >
            A database-verified access key system
          </motion.h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            From payment to a live terminal in three secure steps — no manual
            approval, no shared licenses.
          </p>
        </div>

        <div className="relative mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div
            className="pointer-events-none absolute inset-x-0 top-12 hidden h-px md:block"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(3,201,99,0.4), rgba(7,101,136,0.4), transparent)",
            }}
            aria-hidden
          />
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="glass relative rounded-2xl border border-border p-6"
            >
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-xl border border-brand-green/30 bg-brand-green/10">
                  <s.icon className="size-6 text-brand-green" />
                </div>
                <span className="font-heading text-3xl font-extrabold text-muted-foreground/30">
                  {s.step}
                </span>
              </div>
              <h3 className="mt-5 font-heading text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {s.body}
              </p>
              {i < steps.length - 1 && (
                <ArrowRight className="absolute -right-3 top-11 hidden size-6 text-brand-green/60 md:block" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
