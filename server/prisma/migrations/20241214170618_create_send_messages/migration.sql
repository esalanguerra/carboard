-- CreateTable
CREATE TABLE "SendMessages" (
    "id" TEXT NOT NULL,
    "message_text" TEXT NOT NULL,
    "whatsapp_number" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,

    CONSTRAINT "SendMessages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SendMessages" ADD CONSTRAINT "SendMessages_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
