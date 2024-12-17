-- CreateTable
CREATE TABLE "Customers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "vat" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Customers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customers_vat_key" ON "Customers"("vat");

-- CreateIndex
CREATE UNIQUE INDEX "Customers_user_id_key" ON "Customers"("user_id");

-- AddForeignKey
ALTER TABLE "Customers" ADD CONSTRAINT "Customers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
