import { PrismaClient } from "@/generated/prisma/client";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import crypto from "crypto";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL as string,
});

export const db = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

export type CreateLicensePayload = {
  email: string;
  productName: string;
  maxTerminals: number;
  amount: number;
  peachPaymentId?: string;
  expiresAt?: Date | null;
};

/**
 * Generates a secure, formatted license key (e.g., NEXU-A1B2-C3D4E5F6-G7H8)
 */
function generateLicenseKey(): string {
  const segment1 = crypto.randomBytes(2).toString("hex").toUpperCase();
  const segment2 = crypto.randomBytes(4).toString("hex").toUpperCase();
  const segment3 = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `NEXU-${segment1}-${segment2}-${segment3}`;
}

/**
 * Atomically creates a user (or finds existing), records the transaction, and issues a license.
 */
export async function createLicense(payload: CreateLicensePayload) {
  const { email, productName, maxTerminals, amount, peachPaymentId, expiresAt } = payload;
  const licenseKey = generateLicenseKey();

  return await db.$transaction(async (tx) => {
    const user = await tx.user.upsert({
      where: { email },
      update: {},
      create: { email },
    });

    const paymentTransaction = await tx.transaction.create({
      data: {
        userId: user.id,
        amount,
        productName,
        peachPaymentId: peachPaymentId || null,
        status: "COMPLETED",
      },
    });

    const license = await tx.license.create({
      data: {
        licenseKey,
        productName,
        maxTerminals,
        expiresAt: expiresAt || null,
        userId: user.id,
        transactionId: paymentTransaction.id,
      },
    });

    return license;
  });
}

/**
 * Queries a license by its unique key and includes the associated user email.
 */
export async function findLicense(licenseKey: string) {
  return await db.license.findUnique({
    where: { licenseKey },
    include: {
      user: {
        select: { email: true }
      }
    }
  });
}