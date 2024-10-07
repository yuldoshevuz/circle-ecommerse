/*
  Warnings:

  - Added the required column `total_price` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_price` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "total_price" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "total_price" TEXT NOT NULL;
