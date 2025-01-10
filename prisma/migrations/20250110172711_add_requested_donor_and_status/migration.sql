-- AlterEnum
ALTER TYPE "RequestedDonorStatus" ADD VALUE 'COMPLETED';

-- AlterTable
ALTER TABLE "Token" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + interval '15 minutes';
