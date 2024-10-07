-- DropForeignKey
ALTER TABLE "StockConfiguration" DROP CONSTRAINT "StockConfiguration_attribute_id_fkey";

-- AddForeignKey
ALTER TABLE "StockConfiguration" ADD CONSTRAINT "StockConfiguration_attribute_id_fkey" FOREIGN KEY ("attribute_id") REFERENCES "Attribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;
