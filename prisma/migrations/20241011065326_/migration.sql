/*
  Warnings:

  - You are about to drop the column `email_verified_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "email_verified_at",
DROP COLUMN "password",
ADD COLUMN     "google_id" TEXT;
