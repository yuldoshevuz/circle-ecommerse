/*
  Warnings:

  - You are about to drop the `_ProductAttribute` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ProductAttribute" DROP CONSTRAINT "_ProductAttribute_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductAttribute" DROP CONSTRAINT "_ProductAttribute_B_fkey";

-- DropTable
DROP TABLE "_ProductAttribute";
