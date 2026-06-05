/*
  Warnings:

  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('PRODEV', 'GROUP', 'EMPLOYER');

-- CreateEnum
CREATE TYPE "PlanTier" AS ENUM ('BASIC', 'STARTER', 'PREMIUM', 'ESSENTIAL', 'GROWTH', 'ENTERPRISE', 'PROFESSIONAL');

-- CreateEnum
CREATE TYPE "PlanStatus" AS ENUM ('paid', 'pending', 'failed', 'canceled');

-- DropIndex
DROP INDEX "users_isActive_idx";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "name",
ADD COLUMN     "abnDetails" JSONB,
ADD COLUMN     "certCredits" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "company" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "cookiePolicyAgreed" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "deletionAt" TIMESTAMP(3),
ADD COLUMN     "disabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "interestType" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "jobRole" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "leadSource" TEXT NOT NULL DEFAULT 'Website',
ADD COLUMN     "marketingConsent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "moneySavedWithMembership" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "phoneNumber" TEXT NOT NULL,
ADD COLUMN     "privacyPolicyAgreed" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "scheduledDeletion" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "staff" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "stripeId" TEXT,
ADD COLUMN     "termAndCondAgreed" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "totalCertCredits" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalPdevUsersCredited" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "trainingResourcesDownloads" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "unitCredits" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "memberships" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "PlanType" NOT NULL,
    "planTier" "PlanTier" NOT NULL,
    "status" "PlanStatus" NOT NULL DEFAULT 'pending',
    "paymentId" TEXT,
    "membershipId" TEXT,
    "placedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "billing_addresses" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT,
    "postalAddress" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "billing_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "memberships_userId_idx" ON "memberships"("userId");

-- CreateIndex
CREATE INDEX "memberships_status_idx" ON "memberships"("status");

-- CreateIndex
CREATE INDEX "billing_addresses_userId_idx" ON "billing_addresses"("userId");

-- CreateIndex
CREATE INDEX "users_disabled_idx" ON "users"("disabled");

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "billing_addresses" ADD CONSTRAINT "billing_addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
