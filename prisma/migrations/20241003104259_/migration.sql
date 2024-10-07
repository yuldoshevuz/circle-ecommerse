/*
  Warnings:

  - You are about to drop the `_AttributeValueToStockConfiguration` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AttributeValueToStockConfiguration" DROP CONSTRAINT "_AttributeValueToStockConfiguration_A_fkey";

-- DropForeignKey
ALTER TABLE "_AttributeValueToStockConfiguration" DROP CONSTRAINT "_AttributeValueToStockConfiguration_B_fkey";

-- DropTable
DROP TABLE "_AttributeValueToStockConfiguration";

-- CreateTable
CREATE TABLE "_StockConfigurationAttributeValue" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_StockConfigurationAttributeValue_AB_unique" ON "_StockConfigurationAttributeValue"("A", "B");

-- CreateIndex
CREATE INDEX "_StockConfigurationAttributeValue_B_index" ON "_StockConfigurationAttributeValue"("B");

-- AddForeignKey
ALTER TABLE "_StockConfigurationAttributeValue" ADD CONSTRAINT "_StockConfigurationAttributeValue_A_fkey" FOREIGN KEY ("A") REFERENCES "AttributeValue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StockConfigurationAttributeValue" ADD CONSTRAINT "_StockConfigurationAttributeValue_B_fkey" FOREIGN KEY ("B") REFERENCES "StockConfiguration"("id") ON DELETE CASCADE ON UPDATE CASCADE;
