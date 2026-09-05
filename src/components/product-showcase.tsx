"use client";

import { ArrowRight, Check, Cpu } from "lucide-react";
import { motion } from "motion/react";

import { products, type Product } from "@/lib/products";
import { usePurchase } from "./purchase-context";

function ProductCard({ product }: { product: Product }) {
  const { openCheckout } = usePurchase();

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="gradient-border glass-panel relative flex flex-col overflow-hidden rounded-2xl p-6 transition-shadow duration-500 hover:shadow-[0_20px_60px_-24px_rgba(3,201,99,.45)] sm:p-8"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand-green/30 bg-brand-green-soft">
            <Cpu className="h-5 w-5 text-brand-green" />
          </span>
          <div>
            <h3 className="font-heading text-xl font-extrabold tracking-tight">
              {product.name}
            </h3>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              MetaTrader 5 Expert Advisor
            </p>
          </div>
        </div>
        <span className="rounded-full bg-brand-green px-2 py-1 text-[10px] text-center font-bold text-primary-foreground">
          {product.badge}
        </span>
      </div>

      <p className="mt-5 text-pretty text-sm leading-relaxed text-muted-foreground">
        {product.tagline}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-2">
        {product.tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-2 rounded-lg border border-border bg-secondary/40 px-3 py-2 text-xs font-medium text-foreground"
          >
            <Check className="h-3.5 w-3.5 shrink-0 text-brand-green" />
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-7 flex items-end justify-between border-t border-border/60 pt-6">
        <div>
          <p className="text-sm text-muted-foreground line-through">
            {product.originalPrice}
          </p>
          <p className="font-heading text-3xl font-extrabold text-foreground">
            {product.price}
          </p>
        </div>
      </div>

      <button
        onClick={() => openCheckout(product)}
        className="cursor-pointer group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-green px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_10px_30px_-10px_rgba(3,201,99,0.6)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
      >
        Purchase License
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </button>
    </motion.article>
  );
}

export function ProductShowcase() {
  return (
    <section id="algorithms" className="px-4 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-green">
            The Arsenal
          </span>
          <h2 className="mt-3 text-balance font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
            Deploy a Battle-Tested Algorithm
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Each system ships as a compiled MetaTrader 5 binary with a
            hardware-locked license key and full onboarding documentation.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
