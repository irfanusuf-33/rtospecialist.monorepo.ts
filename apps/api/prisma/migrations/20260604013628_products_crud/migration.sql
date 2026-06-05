-- CreateEnum
CREATE TYPE "GroupType" AS ENUM ('Elective Units', 'Core Units');

-- CreateEnum
CREATE TYPE "QualificationLevel" AS ENUM ('Advanced Diploma', 'Certificate I', 'Certificate II', 'Certificate III', 'Certificate IV', 'Diploma', 'Graduate Diploma');

-- CreateEnum
CREATE TYPE "VersionStatus" AS ENUM ('available', 'update', 'locked');

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "productId" VARCHAR(100) NOT NULL,
    "name" VARCHAR(1000) NOT NULL,
    "description" VARCHAR(5000) NOT NULL,
    "aboutUnit" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "targetLearnerDescription" VARCHAR(5000),
    "targetLearnerBullets" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "learningOutcomesDescription" VARCHAR(5000),
    "learningOutcomesBullets" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "productDetails" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "productDetailsSections" JSONB[] DEFAULT ARRAY[]::JSONB[],
    "link" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "salePrice" DOUBLE PRECISION NOT NULL,
    "group" "GroupType" NOT NULL,
    "qualificationLevel" "QualificationLevel"[] DEFAULT ARRAY[]::"QualificationLevel"[],
    "preOrder" BOOLEAN NOT NULL DEFAULT false,
    "fileUploaded" BOOLEAN NOT NULL DEFAULT false,
    "versionNumber" INTEGER NOT NULL DEFAULT 1,
    "versionStatus" "VersionStatus" NOT NULL DEFAULT 'available',
    "categoryIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "subcategoryIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "products_productId_key" ON "products"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "products_link_key" ON "products"("link");
