"use client";

import { motion } from "motion/react";

import { products, type Product } from "@/lib/products";
import { ProductCard } from "./product-card";

export function ProductGrid({
  onPurchase,
}: {
  onPurchase: (p: Product) => void;
}) {
  return (
    <section id="algorithms" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-sm font-semibold uppercase tracking-widest text-brand-green"
          >
            Trading Systems
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-3 font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl"
          >
            Purpose-built algorithms, licensed per terminal
          </motion.h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Each system ships as a compiled MetaTrader 5 expert advisor with a
            unique, hardware-locking access key.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-md grid-cols-1 gap-6">
          {products.map((p, i) => (
            <ProductCard
              key={p.id}
              product={p}
              index={i}
              onPurchase={onPurchase}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
