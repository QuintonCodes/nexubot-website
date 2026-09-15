// Force Next.js to bypass the cache so the page dynamically evaluates
// the database state and search params on every request in Vercel.
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { SuccessDashboard } from "@/components/success-dashboard";
import { db } from "@/lib/db";
import { products } from "@/lib/products";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{
    receipt_id?: string;
    payment_id?: string;
    key?: string;
  }>;
}) {
  const { receipt_id, payment_id, key } = await searchParams;
  const whopId = receipt_id || payment_id;

  const cookieStore = await cookies();
  const pendingTxId = cookieStore.get("pending_tx_id")?.value;

  if (!whopId && !key && !pendingTxId) {
    redirect("/");
  }

  // Use OR clause to locate the transaction safely, accommodating edge cases
  // where Whop strips query parameters or mismatches IDs on retries.
  const transaction = await db.transaction.findFirst({
    where: {
      OR: [
        ...(key ? [{ license: { licenseKey: key } }] : []),
        ...(pendingTxId ? [{ id: pendingTxId }] : []),
        ...(whopId ? [{ whopPaymentId: whopId }] : []),
      ],
    },
    include: { license: true },
  });

  // If no transaction is found, or the license isn't active yet, render loading wrapper
  if (!transaction || !transaction.license?.isActive) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4 pb-16 pt-32 sm:px-6 lg:pt-40 text-center">
        {/*
          Client-side Polling: Replaces <meta httpEquiv="refresh">.
          Reloads the page after 4 seconds to check the DB, but clears the timer
          if the user navigates away, preventing the infinite navigation trap.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              const timer = setTimeout(() => window.location.reload(), 4000);
              window.addEventListener('beforeunload', () => clearTimeout(timer));
            `,
          }}
        />

        <div className="glass-panel max-w-lg rounded-2xl p-8">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-brand-green border-t-transparent" />
          <h1 className="text-xl font-semibold">Verifying Payment...</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            We are waiting for Whop to confirm your transaction. This usually
            takes a few seconds. The page will refresh automatically.
          </p>
        </div>
      </main>
    );
  }

  // Match the product name from the database to your local products array
  const selectedProduct = products.find(
    (item) =>
      item.id === transaction.productName ||
      item.name === transaction.productName,
  );
  if (!selectedProduct) notFound();

  return (
    <SuccessDashboard
      product={selectedProduct}
      licenseKey={transaction.license.licenseKey}
    />
  );
}
