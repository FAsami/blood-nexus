-- CreateEnum
CREATE TYPE "BloodDonationRequestPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- AlterTable
ALTER TABLE "BloodDonationRequest" ADD COLUMN     "priority" "BloodDonationRequestPriority" NOT NULL DEFAULT 'MEDIUM';

-- AlterTable
ALTER TABLE "Token" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + interval '15 minutes';
