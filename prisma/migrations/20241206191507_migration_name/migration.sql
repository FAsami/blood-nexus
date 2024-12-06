/*
  Warnings:

  - You are about to drop the column `userId` on the `BloodDonationRequest` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "BloodDonationRequest" DROP CONSTRAINT "BloodDonationRequest_userId_fkey";

-- AlterTable
ALTER TABLE "BloodDonationRequest" DROP COLUMN "userId",
ADD COLUMN     "donorId" TEXT,
ADD COLUMN     "requesterId" TEXT;

-- AlterTable
ALTER TABLE "Token" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + interval '15 minutes';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "addressId" INTEGER,
ADD COLUMN     "age" INTEGER,
ADD COLUMN     "bloodGroup" "BloodGroup",
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "isActive" BOOLEAN DEFAULT true,
ADD COLUMN     "isAvailableForDonation" BOOLEAN DEFAULT false,
ADD COLUMN     "lastDonatedOn" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloodDonationRequest" ADD CONSTRAINT "BloodDonationRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloodDonationRequest" ADD CONSTRAINT "BloodDonationRequest_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
