/*
  Warnings:

  - You are about to drop the column `experies_in` on the `refresh_token` table. All the data in the column will be lost.
  - Added the required column `expires_in` to the `refresh_token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "refresh_token" DROP COLUMN "experies_in",
ADD COLUMN     "expires_in" INTEGER NOT NULL;
