/*
  Warnings:

  - You are about to drop the `Reward` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Reward" DROP CONSTRAINT "Reward_imvu_account_id_fkey";

-- DropTable
DROP TABLE "Reward";

-- CreateTable
CREATE TABLE "rewards" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "imvu_account_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rewards_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "rewards" ADD CONSTRAINT "rewards_imvu_account_id_fkey" FOREIGN KEY ("imvu_account_id") REFERENCES "user_imvu_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
