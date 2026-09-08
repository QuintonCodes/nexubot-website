"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.email("Please provide a valid email address"),
  topic: z.string().min(1, "Topic is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  consent: z.literal(true, {
    message: "You must accept the conditions",
  }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      topic: "support",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      await axios.post("/api/emails/contact", data);
      setSent(true);
    } catch (error) {
      console.error("Failed to send message", error);
      toast.error("Failed to send message. Please try again later.");
    }
  };

  if (sent)
    return (
      <div className="glass-panel rounded-2xl p-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-green">
          Message queued
        </p>
        <h2 className="mt-3 text-2xl font-semibold">
          Thanks for reaching out.
        </h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          Our support team will review your message. Please do not send
          passwords, private keys, or broker credentials.
        </p>
      </div>
    );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="glass-panel space-y-5 rounded-2xl p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="space-y-2 text-sm font-medium">
          Name
          <input
            {...register("name")}
            className="field"
            placeholder="Your Name"
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
          )}
        </label>
        <label className="space-y-2 text-sm font-medium">
          Email
          <input
            {...register("email")}
            type="email"
            className="field"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}
        </label>
      </div>
      <label className="block space-y-2 text-sm font-medium">
        Topic
        <select {...register("topic")} className="field">
          <option value="support">Product support</option>
          <option value="licensing">Licensing</option>
          <option value="order">Order question</option>
          <option value="general">General enquiry</option>
        </select>
        {errors.topic && (
          <p className="text-xs text-red-500 mt-1">{errors.topic.message}</p>
        )}
      </label>
      <label className="block space-y-2 text-sm font-medium">
        Message
        <textarea
          {...register("message")}
          rows={6}
          className="field resize-y"
          placeholder="How can we help?"
        />
        {errors.message && (
          <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>
        )}
      </label>
      <label className="flex items-start gap-3 text-xs leading-5 text-muted-foreground">
        <input
          {...register("consent")}
          type="checkbox"
          className="mt-1 accent-brand-green"
        />
        <div>
          I understand that Nexubot Systems provides software tools, not
          financial advice, and I will not include sensitive credentials.
          {errors.consent && (
            <p className="text-xs text-red-500 mt-1 block">
              {errors.consent.message}
            </p>
          )}
        </div>
      </label>
      <button
        type="submit"
        disabled={isSubmitting}
        className="cursor-pointer w-full rounded-xl bg-brand-green px-5 py-3 text-sm font-semibold text-background transition hover:brightness-110"
      >
        {isSubmitting ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
