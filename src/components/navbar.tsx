"use client";

import { Menu, X } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { Logo } from "./logo";

const links = [
  { label: "Algorithms", href: "/#algorithms" },
  { label: "Licensing", href: "/#licensing" },
  { label: "Performance", href: "/#performance" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  function scrollToEAs() {
    if (pathname !== "/") {
      router.push("/#algorithms");
    } else {
      document
        .getElementById("algorithms")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <nav
        className={cn(
          "mx-auto mt-3 flex w-[calc(100%-1.5rem)] max-w-6xl items-center justify-between rounded-2xl px-4 py-3 transition-all duration-300 sm:px-5",
          scrolled
            ? "glass-panel shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)]"
            : "bg-transparent",
        )}
      >
        <Link href="/" aria-label="Nexubot Systems home">
          <Logo />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={scrollToEAs}
            className="cursor-pointer hidden rounded-lg border border-brand-green/40 bg-brand-green-soft px-4 py-2 text-sm font-semibold text-foreground shadow-[0_0_0_1px_rgba(3,201,99,0.15),0_8px_24px_-8px_rgba(3,201,99,0.45)] transition-all hover:bg-brand-green/20 hover:shadow-[0_0_0_1px_rgba(3,201,99,0.3),0_10px_30px_-8px_rgba(3,201,99,0.6)] md:inline-flex"
          >
            Choose Your EA
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="cursor-pointer inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel mx-3 mt-2 flex flex-col gap-1 rounded-2xl p-3 md:hidden"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => {
              setOpen(false);
              scrollToEAs();
            }}
            className="cursor-pointer mt-1 rounded-lg border border-brand-green/40 bg-brand-green-soft px-3 py-2.5 text-sm font-semibold text-foreground"
          >
            Choose Your EA
          </button>
        </motion.div>
      )}
    </motion.header>
  );
}
