import { Hero } from "@/components/hero";
import { Licensing } from "@/components/licensing";
import { PerformanceMetrics } from "@/components/performance-metrics";
import { ProductShowcase } from "@/components/product-showcase";

export default function Page() {
  return (
    <section>
      <Hero />
      <PerformanceMetrics />
      <ProductShowcase />
      <Licensing />
    </section>
  );
}
