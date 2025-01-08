-- AlterTable
ALTER TABLE "Token" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + interval '15 minutes';
