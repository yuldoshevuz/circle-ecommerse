/*
  Warnings:

  - You are about to drop the `_StockConfigurationAttributeValue` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `value_id` to the `StockConfiguration` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_StockConfigurationAttributeValue" DROP CONSTRAINT "_StockConfigurationAttributeValue_A_fkey";

-- DropForeignKey
ALTER TABLE "_StockConfigurationAttributeValue" DROP CONSTRAINT "_StockConfigurationAttributeValue_B_fkey";

-- AlterTable
ALTER TABLE "StockConfiguration" ADD COLUMN     "value_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "_StockConfigurationAttributeValue";

-- CreateTable
CREATE TABLE "_ProductAttribute" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProductAttribute_AB_unique" ON "_ProductAttribute"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductAttribute_B_index" ON "_ProductAttribute"("B");

-- AddForeignKey
ALTER TABLE "StockConfiguration" ADD CONSTRAINT "StockConfiguration_value_id_fkey" FOREIGN KEY ("value_id") REFERENCES "AttributeValue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductAttribute" ADD CONSTRAINT "_ProductAttribute_A_fkey" FOREIGN KEY ("A") REFERENCES "Attribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductAttribute" ADD CONSTRAINT "_ProductAttribute_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
