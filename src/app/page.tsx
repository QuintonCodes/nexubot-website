import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Licensing } from "@/components/licensing";
import { Navbar } from "@/components/navbar";
import { PerformanceMetrics } from "@/components/performance-metrics";
import { ProductShowcase } from "@/components/product-showcase";
import { PurchaseProvider } from "@/components/purchase-context";

export default function Page() {
  return (
    <PurchaseProvider>
      <div id="top" className="min-h-screen overflow-x-hidden bg-background">
        <Navbar />
        <Hero />
        <PerformanceMetrics />
        <ProductShowcase />
        <Licensing />
        <Footer />
      </div>
    </PurchaseProvider>
  );
}
