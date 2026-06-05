-- CreateEnum
CREATE TYPE "Shift" AS ENUM ('DAY', 'NIGHT', 'ROTATING', 'WEEKEND');

-- CreateEnum
CREATE TYPE "SalaryPeriod" AS ENUM ('YEAR', 'WEEK', 'HOUR');

-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "benefits" TEXT[],
ADD COLUMN     "experience" TEXT,
ADD COLUMN     "remote" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requirements" TEXT[],
ADD COLUMN     "salary_period" "SalaryPeriod" NOT NULL DEFAULT 'YEAR',
ADD COLUMN     "shift" "Shift",
ADD COLUMN     "summary" TEXT,
ADD COLUMN     "urgent" BOOLEAN NOT NULL DEFAULT false;
