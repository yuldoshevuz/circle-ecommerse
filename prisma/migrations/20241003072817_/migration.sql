/*
  Warnings:

  - You are about to drop the column `configurations` on the `Stock` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Stock" DROP COLUMN "configurations";

-- CreateTable
CREATE TABLE "StockConfiguration" (
    "id" TEXT NOT NULL,
    "attribute_id" TEXT NOT NULL,
    "stock_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "attributeId" TEXT NOT NULL,

    CONSTRAINT "StockConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AttributeValueToStockConfiguration" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AttributeValueToStockConfiguration_AB_unique" ON "_AttributeValueToStockConfiguration"("A", "B");

-- CreateIndex
CREATE INDEX "_AttributeValueToStockConfiguration_B_index" ON "_AttributeValueToStockConfiguration"("B");

-- AddForeignKey
ALTER TABLE "StockConfiguration" ADD CONSTRAINT "StockConfiguration_attribute_id_fkey" FOREIGN KEY ("attribute_id") REFERENCES "Attribute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockConfiguration" ADD CONSTRAINT "StockConfiguration_stock_id_fkey" FOREIGN KEY ("stock_id") REFERENCES "Stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AttributeValueToStockConfiguration" ADD CONSTRAINT "_AttributeValueToStockConfiguration_A_fkey" FOREIGN KEY ("A") REFERENCES "AttributeValue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AttributeValueToStockConfiguration" ADD CONSTRAINT "_AttributeValueToStockConfiguration_B_fkey" FOREIGN KEY ("B") REFERENCES "StockConfiguration"("id") ON DELETE CASCADE ON UPDATE CASCADE;
