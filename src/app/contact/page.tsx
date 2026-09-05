"use client";

import { motion } from "motion/react";

import { ContactForm } from "@/components/contact-form";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-4xl px-4 pb-16 pt-32 sm:px-6 lg:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-14"
        >
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-brand-green">
            NEXUBOT / CONTACT
          </p>
          <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
            Let’s make the next step clear.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">
            Send a question about installation, licensing, product fit, or your
            order. We’ll use the details you provide only to respond and support
            your request.
          </p>
        </motion.div>
      </section>
      <section className="mx-auto -mt-16 max-w-2xl px-4 pb-20 sm:px-6">
        <ContactForm />
      </section>
    </main>
  );
}
