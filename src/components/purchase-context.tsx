"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

import type { Product } from "@/lib/products";
import { CheckoutModal } from "./checkout-modal";
import { SuccessDashboard } from "./success-dashboard";

type PurchaseContextValue = { openCheckout: (product: Product) => void };
export const PurchaseContext = createContext<PurchaseContextValue | null>(null);

export function PurchaseProvider({ children }: { children: ReactNode }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [completedProduct, setCompletedProduct] = useState<Product | null>(
    null,
  );
  if (completedProduct) return <SuccessDashboard product={completedProduct} />;
  return (
    <PurchaseContext.Provider value={{ openCheckout: setProduct }}>
      {children}
      {product && (
        <CheckoutModal
          product={product}
          onClose={() => setProduct(null)}
          onSuccess={() => {
            setCompletedProduct(product);
            setProduct(null);
          }}
        />
      )}
    </PurchaseContext.Provider>
  );
}

export function usePurchase() {
  const ctx = useContext(PurchaseContext);
  if (!ctx)
    throw new Error("usePurchase must be used within a PurchaseProvider");
  return ctx;
}
