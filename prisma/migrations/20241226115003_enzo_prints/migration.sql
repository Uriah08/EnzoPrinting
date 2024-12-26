/*
  Warnings:

  - Added the required column `category` to the `CartItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "category" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Purchase" ADD COLUMN     "received" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "transaction" TEXT NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "highlight" BOOLEAN NOT NULL DEFAULT false;
