-- CreateTable
CREATE TABLE "refresh_token" (
    "id" TEXT NOT NULL,
    "experies_in" INTEGER NOT NULL,
    "ip_address" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "refresh_token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "refresh_token_ip_address_key" ON "refresh_token"("ip_address");

-- AddForeignKey
ALTER TABLE "refresh_token" ADD CONSTRAINT "refresh_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
