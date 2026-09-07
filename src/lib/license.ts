import crypto from "crypto";

import { db } from "./db";

/**
 * Generates a secure, formatted license key (e.g., NEXU-A1B2-C3D4E5F6-G7H8)
 */
export function generateLicenseKey(): string {
  const segment1 = crypto.randomBytes(2).toString("hex").toUpperCase();
  const segment2 = crypto.randomBytes(4).toString("hex").toUpperCase();
  const segment3 = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `NEXU-${segment1}-${segment2}-${segment3}`;
}

/**
 * Queries a license by its unique key and includes the associated user email.
 */
export async function findLicense(licenseKey: string) {
  return await db.license.findUnique({
    where: { licenseKey },
  });
}
