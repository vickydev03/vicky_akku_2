/*
  Warnings:

  - You are about to drop the column `workshopId` on the `Order` table. All the data in the column will be lost.
  - Added the required column `productId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productType` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_workshopId_fkey";

-- DropIndex
DROP INDEX "Order_workshopId_idx";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "workshopId",
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "productType" TEXT NOT NULL;
