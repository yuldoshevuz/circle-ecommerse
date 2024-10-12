/*
  Warnings:

  - You are about to drop the `ProductVariant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductVariantAttribute` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProductAttribute` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductVariant" DROP CONSTRAINT "ProductVariant_product_id_fkey";

-- DropForeignKey
ALTER TABLE "ProductVariantAttribute" DROP CONSTRAINT "ProductVariantAttribute_attribute_value_id_fkey";

-- DropForeignKey
ALTER TABLE "ProductVariantAttribute" DROP CONSTRAINT "ProductVariantAttribute_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "_ProductAttribute" DROP CONSTRAINT "_ProductAttribute_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductAttribute" DROP CONSTRAINT "_ProductAttribute_B_fkey";

-- DropTable
DROP TABLE "ProductVariant";

-- DropTable
DROP TABLE "ProductVariantAttribute";

-- DropTable
DROP TABLE "_ProductAttribute";

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
ALTER TABLE "StockConfiguration" ADD CONSTRAINT "StockConfiguration_attribute_id_fkey" FOREIGN KEY ("attribute_id") REFERENCES "Attribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StockConfigurationAttributeValue" ADD CONSTRAINT "_StockConfigurationAttributeValue_A_fkey" FOREIGN KEY ("A") REFERENCES "AttributeValue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StockConfigurationAttributeValue" ADD CONSTRAINT "_StockConfigurationAttributeValue_B_fkey" FOREIGN KEY ("B") REFERENCES "StockConfiguration"("id") ON DELETE CASCADE ON UPDATE CASCADE;
