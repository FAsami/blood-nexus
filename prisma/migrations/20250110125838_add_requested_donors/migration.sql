-- CreateEnum
CREATE TYPE "RequestedDonorStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'IGNORED');

-- AlterTable
ALTER TABLE "Token" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + interval '15 minutes';

-- CreateTable
CREATE TABLE "RequestedDonor" (
    "id" TEXT NOT NULL,
    "bloodDonationRequestId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "RequestedDonorStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "RequestedDonor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RequestedDonor_bloodDonationRequestId_userId_key" ON "RequestedDonor"("bloodDonationRequestId", "userId");

-- AddForeignKey
ALTER TABLE "RequestedDonor" ADD CONSTRAINT "RequestedDonor_bloodDonationRequestId_fkey" FOREIGN KEY ("bloodDonationRequestId") REFERENCES "BloodDonationRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestedDonor" ADD CONSTRAINT "RequestedDonor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
