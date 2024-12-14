-- CreateTable
CREATE TABLE "TemplateMessages" (
    "id" TEXT NOT NULL,
    "message_text_template" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TemplateMessages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TemplateMessages" ADD CONSTRAINT "TemplateMessages_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
