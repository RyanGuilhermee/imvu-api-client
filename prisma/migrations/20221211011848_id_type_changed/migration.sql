/*
  Warnings:

  - The primary key for the `user_imvu_accounts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "rewards" DROP CONSTRAINT "rewards_imvu_account_id_fkey";

-- DropForeignKey
ALTER TABLE "user_imvu_accounts" DROP CONSTRAINT "user_imvu_accounts_user_id_fkey";

-- AlterTable
ALTER TABLE "rewards" ALTER COLUMN "imvu_account_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "user_imvu_accounts" DROP CONSTRAINT "user_imvu_accounts_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "user_imvu_accounts_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "user_imvu_accounts_id_seq";

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "users_id_seq";

-- AddForeignKey
ALTER TABLE "user_imvu_accounts" ADD CONSTRAINT "user_imvu_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rewards" ADD CONSTRAINT "rewards_imvu_account_id_fkey" FOREIGN KEY ("imvu_account_id") REFERENCES "user_imvu_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
