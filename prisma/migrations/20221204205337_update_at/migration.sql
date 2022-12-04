/*
  Warnings:

  - Added the required column `update_at` to the `user_imvu_accounts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_imvu_accounts" ADD COLUMN     "update_at" TIMESTAMP(3) NOT NULL;
