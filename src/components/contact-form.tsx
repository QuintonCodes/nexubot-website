"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

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
      onSubmit={submit}
      className="glass-panel space-y-5 rounded-2xl p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="space-y-2 text-sm font-medium">
          Name
          <input required name="name" className="field" />
        </label>
        <label className="space-y-2 text-sm font-medium">
          Email
          <input required type="email" name="email" className="field" />
        </label>
      </div>
      <label className="block space-y-2 text-sm font-medium">
        Topic
        <select name="topic" className="field">
          <option value="support">Product support</option>
          <option value="licensing">Licensing</option>
          <option value="order">Order question</option>
          <option value="general">General enquiry</option>
        </select>
      </label>
      <label className="block space-y-2 text-sm font-medium">
        Message
        <textarea required name="message" rows={6} className="field resize-y" />
      </label>
      <label className="flex items-start gap-3 text-xs leading-5 text-muted-foreground">
        <input required type="checkbox" className="mt-1 accent-brand-green" />I
        understand that Nexubot provides software tools, not financial advice,
        and I will not include sensitive credentials.
      </label>
      <button className="cursor-pointer w-full rounded-xl bg-brand-green px-5 py-3 text-sm font-semibold text-background transition hover:brightness-110">
        Send message
      </button>
    </form>
  );
}
