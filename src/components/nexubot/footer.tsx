import { Logo } from './logo'

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Institutional-grade algorithmic trading systems for the modern MetaTrader
              5 operator. Trade with structure, not emotion.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <div>
              <h4 className="text-sm font-semibold text-foreground">Product</h4>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li><a href="#algorithms" className="hover:text-foreground">Algorithms</a></li>
                <li><a href="#performance" className="hover:text-foreground">Performance</a></li>
                <li><a href="#licensing" className="hover:text-foreground">Licensing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Support</h4>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Setup Guide</a></li>
                <li><a href="#" className="hover:text-foreground">VPS Hosting</a></li>
                <li><a href="#" className="hover:text-foreground">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Legal</h4>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Risk Disclosure</a></li>
                <li><a href="#" className="hover:text-foreground">Terms</a></li>
                <li><a href="#" className="hover:text-foreground">Privacy</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Trading foreign exchange and CFDs carries a high level of risk and may not be
            suitable for all investors. Past performance and backtested results are not
            indicative of future results. Nexubot provides software tools only and does
            not offer financial advice.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            © {new Date().getFullYear()} Nexubot. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
