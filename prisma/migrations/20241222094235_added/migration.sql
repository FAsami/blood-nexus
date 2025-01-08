-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "districtId" TEXT,
ADD COLUMN     "divisionId" TEXT,
ADD COLUMN     "upazilaId" TEXT;

-- AlterTable
ALTER TABLE "Token" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + interval '15 minutes';
