-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "sub_firebase" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_sub_firebase_key" ON "Users"("sub_firebase");
