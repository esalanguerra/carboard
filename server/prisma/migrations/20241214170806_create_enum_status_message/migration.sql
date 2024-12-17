/*
  Warnings:

  - Added the required column `status` to the `SendMessages` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MESSAGE_STATUS" AS ENUM ('SENT', 'NOT_SENT', 'PENDING', 'FAILED', 'CANCELED');

-- AlterTable
ALTER TABLE "SendMessages" ADD COLUMN     "status" "MESSAGE_STATUS" NOT NULL;
