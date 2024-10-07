/*
  Warnings:

  - Added the required column `configuration` to the `Stock` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Stock" ADD COLUMN     "configuration" JSONB NOT NULL;
