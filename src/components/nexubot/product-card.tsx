"use client";

import { ArrowRight, Check } from "lucide-react";
import { motion } from "motion/react";

import type { Product } from "@/lib/products";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  index,
  onPurchase,
}: {
  product: Product;
  index: number;
  onPurchase: (p: Product) => void;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        "group relative flex flex-col rounded-2xl p-6 sm:p-7",
        product.featured
          ? "gradient-border glow-green"
          : "gradient-border-hover",
      )}
    >
      {product.badge && (
        <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary-foreground">
          {product.badge}
        </span>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-2xl font-bold tracking-tight">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {product.tagline}
          </p>
        </div>
      </div>

      <p className="mt-4 text-pretty text-sm leading-relaxed text-muted-foreground">
        {product.description}
      </p>

      <div className="mt-6 flex items-end gap-3">
        <span className="font-heading text-3xl font-extrabold text-foreground">
          {product.promoPrice}
        </span>
        <span className="mb-1 text-sm font-medium text-muted-foreground line-through">
          {product.originalPrice}
        </span>
        <span className="mb-1 rounded-md bg-secondary px-2 py-0.5 text-xs font-semibold text-brand-green">
          {product.usdPrice}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {product.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-xs font-medium text-foreground"
          >
            <Check className="size-3.5 shrink-0 text-brand-green" />
            {tag}
          </span>
        ))}
      </div>

      <button
        onClick={() => onPurchase(product)}
        className={cn(
          "group/btn mt-7 inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-transform hover:scale-[1.02] active:scale-95",
          product.featured
            ? "glow-green bg-primary text-primary-foreground"
            : "border border-border bg-secondary text-foreground hover:bg-secondary/70",
        )}
      >
        Purchase License
        <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-0.5" />
      </button>
    </motion.article>
  );
}
