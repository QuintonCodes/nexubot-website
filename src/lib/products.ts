export type Spec = {
  label: string
  value: string
}

export type Product = {
  id: string
  name: string
  tagline: string
  badge?: string
  originalPrice: string
  promoPrice: string
  usdPrice: string
  featured?: boolean
  tags: string[]
  description: string
  specs: Spec[]
  included: string[]
}

export const products: Product[] = [
  {
    id: 'nexubot-ict',
    name: 'Nexubot ICT',
    tagline: 'Institutional order-flow automation',
    badge: '50% OFF LAUNCH PROMO',
    originalPrice: 'R5999.00',
    promoPrice: 'R2999.00',
    usdPrice: '$187',
    featured: true,
    description:
      'A precision execution engine built on Inner Circle Trader concepts, mapping smart-money structure and optimal trade entries with adaptive risk control.',
    tags: [
      'ICT OTE Strategy',
      'SMC Structure Detection',
      'Dynamic Loss-Streak Protection',
      'Multi-TP Target Management',
      'Session-Based Filtering',
      'Auto Lot Sizing',
    ],
    specs: [
      { label: 'Platform', value: 'MetaTrader 5' },
      { label: 'Recommended Pairs', value: 'XAUUSD, EURUSD, GBPUSD' },
      { label: 'Timeframes', value: 'M15 / H1 / H4' },
      { label: 'Min. Deposit', value: '$3,000 recommended' },
      { label: 'License Type', value: 'Hardware-locked EA' },
      { label: 'Terminals', value: '1 active terminal' },
    ],
    included: [
      'Compiled Nexubot_ICT.ex5 expert advisor',
      'Cryptographic license key (NEXU-)',
      'Nexubot Setup Guide (PDF)',
      'Lifetime updates & priority support',
    ],
  },
]

export type Metric = {
  label: string
  value: string
  sub?: string
  accent?: 'green' | 'blue' | 'neutral'
}

export const metrics: Metric[] = [
  {
    label: 'Return on Investment',
    value: '258.58%',
    sub: 'Initial $3,000.00 → Final $10,757.44',
    accent: 'green',
  },
  {
    label: 'Total Net Profit',
    value: '$7,757.44',
    sub: 'Verified backtest, 12-month window',
    accent: 'green',
  },
  {
    label: 'Win Rate',
    value: '77.31%',
    sub: '92 of 119 trades won',
    accent: 'green',
  },
  {
    label: 'Max Equity Drawdown',
    value: '19.70%',
    sub: '$1,983.23 peak-to-trough',
    accent: 'blue',
  },
  {
    label: 'Total Trades',
    value: '119',
    sub: 'Executions across the period',
    accent: 'neutral',
  },
  {
    label: 'Profit Factor',
    value: '3.42',
    sub: 'Gross profit / gross loss',
    accent: 'neutral',
  },
]
