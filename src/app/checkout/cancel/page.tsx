import { ArrowLeft, CircleAlert, RefreshCw, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <main className="flex min-h-screen items-center px-4 pb-16 pt-32 sm:px-6 lg:pt-40">
      <div className="mx-auto w-full max-w-xl text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-blue/30 bg-brand-blue/10 text-brand-blue">
          <CircleAlert className="h-8 w-8" />
        </div>
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-brand-blue">
          Checkout paused
        </p>
        <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Your payment was not completed.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-pretty text-sm leading-7 text-muted-foreground">
          No charge was made. You can return to the product selection and
          restart checkout whenever you are ready.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/#products"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-green px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            <RefreshCw className="h-4 w-4" /> Try checkout again
          </Link>
          <Link
            href="/support"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold transition-colors hover:border-brand-green/50 hover:text-brand-green"
          >
            <ShieldCheck className="h-4 w-4" /> Contact support
          </Link>
        </div>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Return home
        </Link>
      </div>
    </main>
  );
}
