/*
  Warnings:

  - You are about to drop the column `hospitalId` on the `BloodDonationRequest` table. All the data in the column will be lost.
  - You are about to drop the column `locationDetails` on the `BloodDonationRequest` table. All the data in the column will be lost.
  - You are about to drop the column `locationId` on the `BloodDonationRequest` table. All the data in the column will be lost.
  - You are about to drop the column `reason` on the `BloodDonationRequest` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `zipCode` on the `Patient` table. All the data in the column will be lost.
  - The `gender` column on the `Patient` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Hospital` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[addressId]` on the table `BloodDonationRequest` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `addressId` to the `BloodDonationRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requiredOn` to the `BloodDonationRequest` table without a default value. This is not possible if the table is not empty.
  - Made the column `unit` on table `BloodDonationRequest` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'UNDISCLOSED');

-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('HOSPITAL', 'BLOOD_BANK', 'OTHER');

-- DropForeignKey
ALTER TABLE "BloodDonationRequest" DROP CONSTRAINT "BloodDonationRequest_hospitalId_fkey";

-- AlterTable
ALTER TABLE "BloodDonationRequest" DROP COLUMN "hospitalId",
DROP COLUMN "locationDetails",
DROP COLUMN "locationId",
DROP COLUMN "reason",
ADD COLUMN     "addressId" INTEGER NOT NULL,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "requiredOn" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "unit" SET NOT NULL,
ALTER COLUMN "unit" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "address",
DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "email",
DROP COLUMN "phone",
DROP COLUMN "state",
DROP COLUMN "zipCode",
DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender";

-- AlterTable
ALTER TABLE "Token" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + interval '15 minutes';

-- DropTable
DROP TABLE "Hospital";

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "type" "AddressType" NOT NULL DEFAULT 'OTHER',
    "division" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "upazila" TEXT NOT NULL,
    "streetAddress" TEXT,
    "postalCode" TEXT,
    "landmark" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "instructions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "googlePlaceId" TEXT,
    "googlePlaceDetails" JSONB,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Address_division_district_upazila_idx" ON "Address"("division", "district", "upazila");

-- CreateIndex
CREATE UNIQUE INDEX "BloodDonationRequest_addressId_key" ON "BloodDonationRequest"("addressId");

-- AddForeignKey
ALTER TABLE "BloodDonationRequest" ADD CONSTRAINT "BloodDonationRequest_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE CASCADE ON UPDATE CASCADE;
