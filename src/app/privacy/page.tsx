"use client";

import { motion } from "motion/react";

const sections = [
  {
    title: "Information we may receive",
    body: [
      "This may include your name, email address, order reference, licence details, support messages, device or terminal information, and technical logs needed to secure and operate the service.",
    ],
  },
  {
    title: "How we use it",
    body: [
      "We use information to process purchases, deliver licences, respond to support requests, prevent abuse, maintain records, improve reliability, and meet legal obligations. We do not sell personal information.",
    ],
  },
  {
    title: "Security and retention",
    body: [
      "We use reasonable technical and organisational safeguards. No online service is perfectly secure. We retain information only as needed for the purposes described, legal requirements, dispute resolution, and fraud prevention.",
    ],
  },
  {
    title: "Your choices",
    body: [
      "You may request access, correction, or deletion of personal information where applicable. Contact us with enough detail to verify your request.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 pb-16 pt-32 sm:px-6 lg:pt-40">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-14"
      >
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-brand-green">
          NEXUBOT / PRIVACY
        </p>
        <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
          Privacy policy
        </h1>
        <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">
          We aim to collect only the information needed to provide licensing,
          support, security, and website services.
        </p>
      </motion.div>
      <div className="space-y-10">
        {sections.map((section, index) => (
          <motion.section
            key={section.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: index * 0.04 }}
            className="glass-panel rounded-2xl p-6 sm:p-8"
          >
            <h2 className="text-xl font-semibold">{section.title}</h2>
            <div className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </motion.section>
        ))}
      </div>
    </section>
  );
}
