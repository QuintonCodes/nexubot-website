import { notFound, redirect } from "next/navigation";

import { SuccessDashboard } from "@/components/success-dashboard";
import { findLicense } from "@/lib/license";
import { products } from "@/lib/products";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; key?: string }>;
}) {
  const { product, key } = await searchParams;

  if (!product || !key) {
    redirect("/");
  }

  const selectedProduct = products.find((item) => item.id === product);
  if (!selectedProduct) notFound();

  const license = await findLicense(key);

  if (!license) notFound();

  return (
    <SuccessDashboard
      product={selectedProduct}
      licenseKey={license.licenseKey}
    />
  );
}
