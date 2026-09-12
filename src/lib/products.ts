export type Product = {
  id: string;
  name: string;
  tagline: string;
  badge: string;
  originalPrice: string;
  price: string;
  tags: string[];
};

export const products: Product[] = [
  {
    id: "nexubot-ict",
    name: "Nexubot ICT",
    tagline:
      "Precision ICT execution engine built for OTE entries and Smart Money structure on XAUUSD Gold.",
    badge: "60% OFF LAUNCH PROMO",
    originalPrice: "R4999.00",
    price: "R2999.00",
    tags: [
      "ICT OTE Strategy",
      "SMC Structure Detection",
      "Dynamic Loss-Streak Protection",
      "Multi-TP Target Management",
    ],
  },
  {
    id: "nexubot-poi",
    name: "Nexubot POI",
    tagline:
      "Reversal-entry Expert Advisor that hunts Order Blocks and Liquidity Sweeps on XAUUSD Gold.",
    badge: "60% OFF LAUNCH PROMO",
    originalPrice: "R4999.00",
    price: "R2999.00",
    tags: [
      "Order Block + Liquidity Reversals",
      "SMC Structure Detection",
      "Dynamic Loss-Streak Protection",
      "Multi-TP Target Management",
    ],
  },
];

export const advisorMetrics = {
  ict: {
    name: "Nexubot ICT",
    subtitle: "OTE continuation system",
    roi: "+194.33%",
    profit: "4.62",
    win: 71.43,
    dd: "7.92%",
    trades: 56,
    curve: [
      28, 30, 34, 38, 41, 35, 42, 45, 47, 46, 54, 57, 61, 60, 65, 76, 77, 85,
      90, 96,
    ],
  },
  poi: {
    name: "Nexubot POI",
    subtitle: "Order Block reversal system",
    roi: "+142.36%",
    profit: "1.95",
    win: 71.42,
    dd: "14.28%",
    trades: 84,
    curve: [
      28, 27, 33, 31, 38, 43, 41, 48, 52, 50, 58, 63, 61, 69, 74, 78, 76, 84,
      89, 96,
    ],
  },
};
