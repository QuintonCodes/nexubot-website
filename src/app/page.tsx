"use client";

import { useCallback, useState } from "react";

import { CheckoutModal } from "@/components/nexubot/checkout-modal";
import { Footer } from "@/components/nexubot/footer";
import { Hero } from "@/components/nexubot/hero";
import { Licensing } from "@/components/nexubot/licensing";
import { Metrics } from "@/components/nexubot/metrics";
import { Navbar } from "@/components/nexubot/navbar";
import { ProductGrid } from "@/components/nexubot/product-grid";
import { products, type Product } from "@/lib/products";

export default function HomePage() {
  const [selected, setSelected] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);

  const openCheckout = useCallback((p: Product) => {
    setSelected(p);
    setOpen(true);
  }, []);

  const scrollToAlgorithms = useCallback(() => {
    document
      .getElementById("algorithms")
      ?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <main className="relative min-h-screen">
      <Navbar onGetStarted={() => openCheckout(products[0])} />
      <Hero onExplore={scrollToAlgorithms} />
      <Metrics />
      <ProductGrid onPurchase={openCheckout} />
      <Licensing />
      <Footer />

      <CheckoutModal
        product={selected}
        open={open}
        onClose={() => setOpen(false)}
      />
    </main>
  );
}
