/*
  Warnings:

  - Added the required column `bhk` to the `Buyer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Buyer" DROP COLUMN "bhk",
ADD COLUMN     "bhk" TEXT NOT NULL;
