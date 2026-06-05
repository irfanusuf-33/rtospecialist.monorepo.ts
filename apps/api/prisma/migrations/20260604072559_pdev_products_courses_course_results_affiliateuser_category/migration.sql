-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('Under Review', 'Pending', 'Approved', 'Scheduled', 'Rejected');

-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "permissionGroup" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isDisabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "affiliate_users" (
    "id" TEXT NOT NULL,
    "firstName" VARCHAR(30) NOT NULL,
    "lastName" VARCHAR(30) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "phoneNumber" VARCHAR(20) NOT NULL,
    "termAndCondAgreed" BOOLEAN NOT NULL DEFAULT true,
    "privacyPolicyAgeed" BOOLEAN NOT NULL DEFAULT true,
    "cookiePolicyAgreed" BOOLEAN NOT NULL DEFAULT true,
    "scheduledDeletion" BOOLEAN NOT NULL DEFAULT false,
    "deletionAt" TIMESTAMP(3),
    "isDisabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "affiliate_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pdev_users" (
    "id" TEXT NOT NULL,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "phoneNumber" VARCHAR(30) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "disabled" BOOLEAN NOT NULL DEFAULT false,
    "authToken" TEXT,
    "generalUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pdev_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pdev_product_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isDisabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "pdev_product_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pdev_products" (
    "id" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "name" VARCHAR(500) NOT NULL,
    "description" VARCHAR(5000),
    "fileUploaded" BOOLEAN NOT NULL DEFAULT false,
    "iconUrl" VARCHAR(2000) NOT NULL,
    "features" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "courseFor" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "objectives" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "includes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "parentId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pdev_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pdev_file_data" (
    "id" TEXT NOT NULL,
    "question" VARCHAR(2000) NOT NULL,
    "questionData" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "options" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "answer" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "productId" TEXT NOT NULL,

    CONSTRAINT "pdev_file_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" TEXT NOT NULL,
    "firstName" VARCHAR(30) NOT NULL,
    "lastName" VARCHAR(30) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "companyName" VARCHAR(100) NOT NULL,
    "position" VARCHAR(200) NOT NULL,
    "phoneNumber" VARCHAR(20) NOT NULL,
    "state" VARCHAR(10) NOT NULL,
    "message" VARCHAR(600) NOT NULL,
    "services" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "AppointmentStatus" NOT NULL DEFAULT 'Pending',
    "scheduledDateTime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pdev_product_course_results" (
    "id" TEXT NOT NULL,
    "correctAnswers" VARCHAR(50) NOT NULL,
    "totalQuestions" VARCHAR(50) NOT NULL,
    "fileId" VARCHAR(255) NOT NULL,
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "staffUserId" TEXT NOT NULL,
    "generalUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pdev_product_course_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "affiliate_users_email_key" ON "affiliate_users"("email");

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pdev_users" ADD CONSTRAINT "pdev_users_generalUserId_fkey" FOREIGN KEY ("generalUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pdev_product_categories" ADD CONSTRAINT "pdev_product_categories_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pdev_products" ADD CONSTRAINT "pdev_products_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "pdev_product_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pdev_products" ADD CONSTRAINT "pdev_products_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pdev_file_data" ADD CONSTRAINT "pdev_file_data_productId_fkey" FOREIGN KEY ("productId") REFERENCES "pdev_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pdev_product_course_results" ADD CONSTRAINT "pdev_product_course_results_staffUserId_fkey" FOREIGN KEY ("staffUserId") REFERENCES "pdev_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pdev_product_course_results" ADD CONSTRAINT "pdev_product_course_results_generalUserId_fkey" FOREIGN KEY ("generalUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
