"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Landmark,
  Loader2,
  Lock,
  MonitorSmartphone,
  ServerCog,
  ShieldAlert,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import type { Product } from "@/lib/products";
import { cn } from "@/lib/utils";
import { SuccessDashboard } from "./success-dashboard";

type Step = "prerequisites" | "payment" | "success";

/* ---------------- Schemas ---------------- */

const prereqSchema = z.object({
  acknowledged: z.boolean().refine((v) => v === true, {
    message: "You must acknowledge the hardware prerequisites.",
  }),
});
type PrereqValues = z.infer<typeof prereqSchema>;

const paymentSchema = z
  .object({
    method: z.enum(["card", "bank"]),
    email: z.email("Enter a valid email").min(1, "Billing email is required"),
    cardName: z.string().optional(),
    cardNumber: z.string().optional(),
    expiry: z.string().optional(),
    cvc: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.method === "card") {
      if (!val.cardName || val.cardName.trim().length < 2)
        ctx.addIssue({
          code: "custom",
          path: ["cardName"],
          message: "Cardholder name is required",
        });
      const digits = (val.cardNumber ?? "").replace(/\s/g, "");
      if (digits.length < 15 || digits.length > 16)
        ctx.addIssue({
          code: "custom",
          path: ["cardNumber"],
          message: "Enter a valid card number",
        });
      if (!/^\d{2}\s*\/\s*\d{2}$/.test(val.expiry ?? ""))
        ctx.addIssue({
          code: "custom",
          path: ["expiry"],
          message: "Use MM / YY",
        });
      if (!/^\d{3,4}$/.test(val.cvc ?? ""))
        ctx.addIssue({ code: "custom", path: ["cvc"], message: "Invalid CVC" });
    }
  });
type PaymentValues = z.infer<typeof paymentSchema>;

/* ---------------- Step: Prerequisites ---------------- */

function PrerequisitesStep({ onNext }: { onNext: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PrereqValues>({
    resolver: zodResolver(prereqSchema),
    defaultValues: { acknowledged: false },
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg border border-[#e0a53a]/30 bg-[#e0a53a]/10">
          <ShieldAlert className="size-5 text-[#e0a53a]" />
        </div>
        <div>
          <h3 className="font-heading text-xl font-bold">
            Hardware Prerequisites
          </h3>
          <p className="text-sm text-muted-foreground">
            Please review before payment
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex gap-4 rounded-xl border border-border bg-secondary/40 p-4">
          <ServerCog className="mt-0.5 size-5 shrink-0 text-brand-green" />
          <div>
            <p className="text-sm font-semibold">Running Environment</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              A Virtual Private Server (VPS) running a Windows Server OS 24/7 is
              mandatory to execute trades without disruption.
            </p>
          </div>
        </div>
        <div className="flex gap-4 rounded-xl border border-border bg-secondary/40 p-4">
          <MonitorSmartphone className="mt-0.5 size-5 shrink-0 text-[#3fb4e0]" />
          <div>
            <p className="text-sm font-semibold">Setup Prerequisites</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Initial installation requires a physical desktop OS (Windows
              PC/Laptop or Mac with Windows virtualization). Cannot be operated
              via mobile.
            </p>
          </div>
        </div>
      </div>

      <label
        className={cn(
          "mt-6 flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors",
          errors.acknowledged
            ? "border-destructive/60 bg-destructive/5"
            : "border-border bg-background hover:border-brand-green/40",
        )}
      >
        <input
          type="checkbox"
          {...register("acknowledged")}
          className="mt-0.5 size-5 shrink-0 accent-[#03c963]"
        />
        <span className="text-sm leading-relaxed text-foreground">
          I understand and acknowledge that a Windows VPS and a desktop setup
          environment are required to run Nexubot, and that it cannot be
          operated from a mobile device.
        </span>
      </label>
      {errors.acknowledged && (
        <p className="mt-2 text-sm text-destructive">
          {errors.acknowledged.message}
        </p>
      )}

      <button
        type="submit"
        className="glow-green mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.01] active:scale-95"
      >
        Continue to Payment
        <ArrowRight className="size-4" />
      </button>
    </form>
  );
}

/* ---------------- Step: Payment ---------------- */

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
        {label}
      </span>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-brand-green focus:ring-1 focus:ring-brand-green/40";

function PaymentStep({
  product,
  onBack,
  onSuccess,
}: {
  product: Product;
  onBack: () => void;
  onSuccess: (email: string) => void;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PaymentValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { method: "card", email: "" },
  });

  const method = useWatch({
    control,
    name: "method",
  });

  const onSubmit = async (values: PaymentValues) => {
    // Simulate gateway processing
    await new Promise((r) => setTimeout(r, 1600));
    onSuccess(values.email);
  };

  const formatCard = (v: string) =>
    v
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg border border-brand-green/30 bg-brand-green/10">
          <Lock className="size-5 text-brand-green" />
        </div>
        <div>
          <h3 className="font-heading text-xl font-bold">Secure Checkout</h3>
          <p className="text-sm text-muted-foreground">
            Powered by Peach Payments
          </p>
        </div>
      </div>

      {/* Order summary */}
      <div className="mt-6 flex items-center justify-between rounded-xl border border-border bg-secondary/40 px-4 py-3">
        <div>
          <p className="text-sm font-semibold">{product.name}</p>
          <p className="text-xs text-muted-foreground">
            Single-terminal license
          </p>
        </div>
        <div className="text-right">
          <p className="font-heading text-lg font-bold text-brand-green">
            {product.promoPrice}
          </p>
          <p className="text-xs text-muted-foreground line-through">
            {product.originalPrice}
          </p>
        </div>
      </div>

      {/* Method toggle */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        {(
          [
            { key: "card", label: "Card", icon: CreditCard },
            { key: "bank", label: "Bank Transfer", icon: Landmark },
          ] as const
        ).map((opt) => (
          <button
            type="button"
            key={opt.key}
            onClick={() =>
              setValue("method", opt.key, { shouldValidate: true })
            }
            className={cn(
              "flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-all",
              method === opt.key
                ? "border-brand-green bg-brand-green/10 text-foreground"
                : "border-border bg-background text-muted-foreground hover:text-foreground",
            )}
          >
            <opt.icon className="size-4" />
            {opt.label}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-4">
        <Field label="Billing Email" error={errors.email?.message}>
          <input
            type="email"
            placeholder="you@example.com"
            className={inputClass}
            {...register("email")}
          />
        </Field>

        <AnimatePresence mode="wait">
          {method === "card" ? (
            <motion.div
              key="card"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 overflow-hidden"
            >
              <Field label="Cardholder Name" error={errors.cardName?.message}>
                <input
                  placeholder="Alex Trader"
                  className={inputClass}
                  {...register("cardName")}
                />
              </Field>
              <Field label="Card Number" error={errors.cardNumber?.message}>
                <input
                  inputMode="numeric"
                  placeholder="4242 4242 4242 4242"
                  className={inputClass}
                  {...register("cardNumber")}
                  onChange={(e) =>
                    setValue("cardNumber", formatCard(e.target.value))
                  }
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Expiry" error={errors.expiry?.message}>
                  <input
                    inputMode="numeric"
                    placeholder="MM / YY"
                    className={inputClass}
                    {...register("expiry")}
                    onChange={(e) =>
                      setValue("expiry", formatExpiry(e.target.value))
                    }
                  />
                </Field>
                <Field label="CVC" error={errors.cvc?.message}>
                  <input
                    inputMode="numeric"
                    placeholder="123"
                    maxLength={4}
                    className={inputClass}
                    {...register("cvc")}
                  />
                </Field>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="bank"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-3 rounded-xl border border-border bg-secondary/40 p-4">
                <p className="text-sm font-semibold">
                  Instant EFT / Local Bank Transfer
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  You&apos;ll be redirected to your bank&apos;s secure portal to
                  authorize the payment. Your license activates automatically
                  once funds clear.
                </p>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {["FNB", "ABSA", "Capitec"].map((b) => (
                    <div
                      key={b}
                      className="rounded-lg border border-border bg-background py-2 text-center text-xs font-medium text-muted-foreground"
                    >
                      {b}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-secondary px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/70"
        >
          <ArrowLeft className="size-4" />
          Back
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="glow-green inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.01] active:scale-95 disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Lock className="size-4" />
              Pay {product.promoPrice}
            </>
          )}
        </button>
      </div>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <Lock className="size-3" />
        256-bit encrypted · PCI-DSS compliant gateway
      </p>
    </form>
  );
}

/* ---------------- Modal Shell ---------------- */

export function CheckoutModal({
  product,
  open,
  onClose,
}: {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>("prerequisites");
  const [email, setEmail] = useState("");

  const handleClose = useCallback(() => {
    onClose();
    setTimeout(() => {
      setStep("prerequisites");
      setEmail("");
    }, 400); // Wait for framer-motion exit animation
  }, [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 flex items-start justify-center overflow-y-auto p-4 sm:items-center"
        >
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
            aria-hidden
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Purchase ${product.name}`}
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="glass-strong relative z-10 my-8 w-full max-w-lg rounded-2xl border border-border shadow-2xl"
          >
            {/* Progress header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div className="flex items-center gap-2">
                {(["prerequisites", "payment", "success"] as Step[]).map(
                  (s, i) => {
                    const order = ["prerequisites", "payment", "success"];
                    const active = order.indexOf(step) >= i;
                    return (
                      <div key={s} className="flex items-center gap-2">
                        <span
                          className={cn(
                            "flex size-6 items-center justify-center rounded-full text-xs font-bold transition-colors",
                            active
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-muted-foreground",
                          )}
                        >
                          {i + 1}
                        </span>
                        {i < 2 && (
                          <span
                            className={cn(
                              "h-px w-6 transition-colors",
                              order.indexOf(step) > i
                                ? "bg-primary"
                                : "bg-border",
                            )}
                          />
                        )}
                      </div>
                    );
                  },
                )}
              </div>
              <button
                onClick={handleClose}
                className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="Close checkout"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="max-h-[75vh] overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25 }}
                >
                  {step === "prerequisites" && (
                    <PrerequisitesStep onNext={() => setStep("payment")} />
                  )}
                  {step === "payment" && (
                    <PaymentStep
                      product={product}
                      onBack={() => setStep("prerequisites")}
                      onSuccess={(e) => {
                        setEmail(e);
                        setStep("success");
                      }}
                    />
                  )}
                  {step === "success" && (
                    <SuccessDashboard product={product} email={email} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
