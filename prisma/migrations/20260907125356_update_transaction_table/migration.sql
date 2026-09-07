/*
  Warnings:

  - You are about to drop the column `peachPaymentId` on the `Transaction` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Transaction_peachPaymentId_key";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "peachPaymentId";
