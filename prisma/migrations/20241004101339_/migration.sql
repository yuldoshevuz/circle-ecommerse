-- CreateEnum
CREATE TYPE "RoleUser" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "RoleUser" NOT NULL DEFAULT 'USER';
