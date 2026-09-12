/*
  Warnings:

  - You are about to drop the column `paymentMethod` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `whopSessionId` on the `Transaction` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Transaction_whopSessionId_key";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "paymentMethod",
DROP COLUMN "whopSessionId";
