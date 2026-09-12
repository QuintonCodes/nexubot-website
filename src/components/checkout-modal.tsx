"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  AlertTriangle,
  ArrowRight,
  Loader2,
  Lock,
  MonitorSmartphone,
  Server,
  ShieldCheck,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import type { Product } from "@/lib/products";
import { cn } from "@/lib/utils";

/* ---------------- Step 1: hardware acknowledgement ---------------- */

const ackSchema = z.object({
  acknowledged: z.literal(true, {
    message: "You must acknowledge the hardware prerequisites to continue.",
  }),
});
type AckValues = z.infer<typeof ackSchema>;

/* ---------------- Step 2: payment ---------------- */

const paymentSchema = z.object({
  firstName: z.string().min(2, "First name is required."),
  lastName: z.string().min(2, "Last name is required."),
  email: z.email("Enter a valid billing email."),
});
type PaymentValues = z.infer<typeof paymentSchema>;

/* ---------------- shared field styles ---------------- */

const inputCls =
  "w-full rounded-lg border border-input bg-secondary/50 px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-brand-green focus:ring-1 focus:ring-brand-green";
const labelCls = "mb-1.5 block text-xs font-medium text-muted-foreground";
const errCls = "mt-1 text-xs text-destructive";

export function CheckoutModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const [step, setStep] = useState<"prereq" | "payment">("prereq");
  const [submitting, setSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Resets loading state if user navigates back from Whop (bfcache or tab visibility restore)
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) setSubmitting(false);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") setSubmitting(false);
    };

    window.addEventListener("pageshow", handlePageShow);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const ackForm = useForm<AckValues>({
    resolver: zodResolver(ackSchema),
    defaultValues: { acknowledged: false as unknown as true },
  });

  const payForm = useForm<PaymentValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  const onAck = () => setStep("payment");

  const onPay = async (data: PaymentValues) => {
    setSubmitting(true);
    setCheckoutError(null);
    try {
      const response = await axios.post("/api/whop/checkout", {
        productId: product.id,
        productName: product.name,
        amount: product.price,
        ...data,
      });

      const { checkoutUrl } = response.data;

      if (response.status !== 200 && !checkoutUrl) {
        throw new Error("Unable to start Whop checkout.");
      }

      // Always navigate in the same tab for smooth return_url behavior
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error(error);

      // Extract specific server errors (like the 429 Cooldown)
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        const serverError = error.response.data.error;
        toast.error(serverError);
        setCheckoutError(serverError);
      } else {
        const fallbackError =
          "Payment gateway unavailable. Please try again later.";
        toast.error(fallbackError);
        setCheckoutError(fallbackError);
      }
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-70 flex items-start justify-center overflow-y-auto p-4 sm:items-center">
      {/* backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        role="dialog"
        aria-modal="true"
        aria-label="Checkout"
        className="glass-panel relative my-8 w-full max-w-lg rounded-2xl border border-border shadow-2xl"
      >
        {/* header */}
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Secure Checkout
            </p>
            <p className="font-heading text-base font-bold">
              {product.name} License
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close checkout"
            className="cursor-pointer inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* step indicator */}
        <div className="flex items-center gap-2 px-5 pt-4">
          {(["prereq", "payment"] as const).map((s, i) => (
            <div key={s} className="flex flex-1 items-center gap-2">
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors",
                  step === s || (s === "prereq" && step === "payment")
                    ? "bg-brand-green text-primary-foreground"
                    : "bg-secondary text-muted-foreground",
                )}
              >
                {i + 1}
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                {s === "prereq" ? "Requirements" : "Payment"}
              </span>
            </div>
          ))}
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-5 py-5">
          <AnimatePresence mode="wait">
            {step === "prereq" ? (
              <motion.form
                key="prereq"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25 }}
                onSubmit={ackForm.handleSubmit(onAck)}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-2.5">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />
                  <p className="text-xs font-medium text-foreground">
                    Please select your preferred deployment method before
                    purchasing.
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-secondary/30 p-4">
                  <div className="flex items-start gap-3">
                    <Server className="mt-0.5 h-5 w-5 shrink-0 text-brand-green" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Option 1: Traditional VPS (Maximum Control)
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        Deploy on a 24/7 Windows Virtual Private Server.
                        Requires initial setup via a desktop OS. Best for
                        advanced traders who want full control over server
                        uptime and broker latency.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-secondary/30 p-4">
                  <div className="flex items-start gap-3">
                    <MonitorSmartphone className="mt-0.5 h-5 w-5 shrink-0 text-brand-blue" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Option 2: Mobile Management (Maximum Convenience)
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        Use a third-party app like EAConnect to monitor and
                        intervene directly from your phone. Nexubot retains full
                        control of your license key natively; mobile platforms
                        are used purely for remote management.
                      </p>
                    </div>
                  </div>
                </div>

                <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3.5 transition-colors hover:border-brand-green/40">
                  <input
                    type="checkbox"
                    {...ackForm.register("acknowledged")}
                    className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#03c963]"
                  />
                  <span className="text-xs leading-relaxed text-foreground">
                    I understand the deployment options and confirm I will
                    arrange either a VPS or a mobile hosting bridge to run this
                    algorithm.
                  </span>
                </label>
                {ackForm.formState.errors.acknowledged && (
                  <p className={errCls}>
                    {ackForm.formState.errors.acknowledged.message}
                  </p>
                )}

                <button
                  type="submit"
                  className="cursor-pointer inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-green px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.01] active:scale-[0.99]"
                >
                  Continue to Payment
                  <ArrowRight className="h-4 w-4" />
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="payment"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.25 }}
                onSubmit={payForm.handleSubmit(onPay)}
                className="space-y-4"
              >
                {/* order summary */}
                <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/30 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {product.name}
                    </p>
                    <p className="text-xs text-muted-foreground line-through">
                      {product.originalPrice}
                    </p>
                  </div>
                  <p className="font-heading text-lg font-extrabold text-brand-green">
                    {product.price}
                  </p>
                </div>

                <div className="rounded-xl border border-brand-blue/30 bg-brand-blue/10 p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 shrink-0 text-brand-blue" />
                    <div>
                      <p className="text-sm font-semibold">
                        Payment powered by Whop
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        You will be redirected to Whop to choose your preferred
                        payment method and complete checkout securely.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>First Name</label>
                      <input
                        autoComplete="given-name"
                        placeholder="Jane"
                        className={inputCls}
                        {...payForm.register("firstName")}
                      />
                      {payForm.formState.errors.firstName && (
                        <p className={errCls}>
                          {payForm.formState.errors.firstName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className={labelCls}>Last Name</label>
                      <input
                        autoComplete="family-name"
                        placeholder="Trader"
                        className={inputCls}
                        {...payForm.register("lastName")}
                      />
                      {payForm.formState.errors.lastName && (
                        <p className={errCls}>
                          {payForm.formState.errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Billing Email</label>
                    <input
                      type="email"
                      placeholder="you@email.com"
                      className={inputCls}
                      {...payForm.register("email")}
                    />
                    {payForm.formState.errors.email && (
                      <p className={errCls}>
                        {payForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  {checkoutError && (
                    <p
                      role="alert"
                      className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive"
                    >
                      {checkoutError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="cursor-pointer inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-green px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Opening secure Whop checkout…
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      Continue to Whop · {product.price}
                    </>
                  )}
                </button>
                <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  Secure payment handled by Whop
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
