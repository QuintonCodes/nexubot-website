import { notFound, redirect } from "next/navigation";

import { SuccessDashboard } from "@/components/success-dashboard";
import { findLicense } from "@/lib/license";
import { products } from "@/lib/products";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; key?: string }>;
}) {
  const { product, key } = await searchParams;

  if (!product || !key) {
    redirect("/");
  }

  const selectedProduct = products.find((item) => item.id === product);
  if (!selectedProduct) notFound();

  const license = await findLicense(key);

  if (!license) notFound();

  if (!license.isActive) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4 pb-16 pt-32 sm:px-6 lg:pt-40 text-center">
        <div className="glass-panel max-w-lg rounded-2xl p-8">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-brand-green border-t-transparent" />
          <h1 className="text-xl font-semibold">Verifying Payment</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            We are waiting for Whop to confirm your transaction. This usually
            takes a few seconds. Please refresh this page shortly.
          </p>
        </div>
      </main>
    );
  }

  return (
    <SuccessDashboard
      product={selectedProduct}
      licenseKey={license.licenseKey}
    />
  );
}
