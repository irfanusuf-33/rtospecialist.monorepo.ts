-- CreateEnum
CREATE TYPE "LogCategory" AS ENUM ('AUTH', 'ORDER', 'PRODUCT', 'COURSE_TRAINING', 'SYSTEM');

-- CreateEnum
CREATE TYPE "LogStatus" AS ENUM ('SUCCESS', 'FAILED', 'WARNING');

-- CreateEnum
CREATE TYPE "LogStage" AS ENUM ('STARTED', 'COMPLETED', 'IN_PROGRESS');

-- CreateTable
CREATE TABLE "log_trails" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "accountType" TEXT,
    "email" TEXT,
    "action" TEXT NOT NULL,
    "category" "LogCategory" NOT NULL,
    "status" "LogStatus" NOT NULL DEFAULT 'SUCCESS',
    "stage" "LogStage" NOT NULL DEFAULT 'COMPLETED',
    "target" JSONB NOT NULL DEFAULT '{}',
    "metaData" JSONB NOT NULL DEFAULT '{}',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "log_trails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "log_trails_userId_timestamp_idx" ON "log_trails"("userId", "timestamp" DESC);

-- CreateIndex
CREATE INDEX "log_trails_category_action_timestamp_idx" ON "log_trails"("category", "action", "timestamp" DESC);
