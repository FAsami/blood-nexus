/*
  Warnings:

  - You are about to drop the column `age` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Token" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + interval '15 minutes';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "age",
ADD COLUMN     "dateOfBirth" TIMESTAMP(3);
