/*
  Warnings:

  - The values [FAILED] on the enum `MESSAGE_STATUS` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MESSAGE_STATUS_new" AS ENUM ('SENT', 'NOT_SENT', 'PENDING', 'CANCELED');
ALTER TABLE "SendMessages" ALTER COLUMN "status" TYPE "MESSAGE_STATUS_new" USING ("status"::text::"MESSAGE_STATUS_new");
ALTER TYPE "MESSAGE_STATUS" RENAME TO "MESSAGE_STATUS_old";
ALTER TYPE "MESSAGE_STATUS_new" RENAME TO "MESSAGE_STATUS";
DROP TYPE "MESSAGE_STATUS_old";
COMMIT;

-- AlterTable
ALTER TABLE "Customers" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "SendMessages" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;