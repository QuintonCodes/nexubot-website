import Link from "next/link";

import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="border-t border-border px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Link href="/" aria-label="Nexubot Systems home">
              <Logo />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Institutional-grade algorithmic trading systems for MetaTrader 5.
              Precision execution, verified performance, zero emotion.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <div>
              <p className="text-sm font-semibold text-foreground">Product</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/#algorithms" className="hover:text-foreground">
                    Algorithms
                  </Link>
                </li>
                <li>
                  <Link href="/#performance" className="hover:text-foreground">
                    Performance
                  </Link>
                </li>
                <li>
                  <Link href="/#licensing" className="hover:text-foreground">
                    Licensing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Company</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="hover:text-foreground">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Legal</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/terms" className="hover:text-foreground">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-foreground">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/risk-disclosure"
                    className="hover:text-foreground"
                  >
                    Risk Disclosure
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Trading foreign exchange and derivatives carries a high level of
            risk and may not be suitable for all investors. Past performance is
            not indicative of future results. Nexubot Systems provides algorithmic tools
            only and does not constitute financial advice.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            © {new Date().getFullYear()} Nexubot Systems. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
