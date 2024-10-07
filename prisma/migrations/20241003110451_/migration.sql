-- DropForeignKey
ALTER TABLE "StockConfiguration" DROP CONSTRAINT "StockConfiguration_stock_id_fkey";

-- AddForeignKey
ALTER TABLE "StockConfiguration" ADD CONSTRAINT "StockConfiguration_stock_id_fkey" FOREIGN KEY ("stock_id") REFERENCES "Stock"("id") ON DELETE CASCADE ON UPDATE CASCADE;
