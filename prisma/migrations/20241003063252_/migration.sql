/*
  Warnings:

  - You are about to drop the column `stock_id` on the `AttributeValue` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "AttributeValue" DROP CONSTRAINT "AttributeValue_stock_id_fkey";

-- AlterTable
ALTER TABLE "AttributeValue" DROP COLUMN "stock_id";

-- AlterTable
ALTER TABLE "Stock" ADD COLUMN     "configurations" JSONB[];
