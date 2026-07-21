import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nexubot — Next-Generation Algorithmic Automation",
  description:
    "Institutional-grade algorithmic trading systems. Verified backtested performance, database-secured licensing, and automated MetaTrader 5 deployment.",
  keywords: [
    "algorithmic trading",
    "trading bot",
    "MetaTrader 5",
    "ICT strategy",
    "expert advisor",
    "automated trading",
    "Nexubot",
  ],
  openGraph: {
    title: "Nexubot — Next-Generation Algorithmic Automation",
    description:
      "Institutional-grade algorithmic trading systems with verified backtested performance.",
    type: "website",
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#181818",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${montserrat.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
