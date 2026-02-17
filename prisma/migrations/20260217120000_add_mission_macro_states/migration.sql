-- CreateEnum
CREATE TYPE "public"."MissionState" AS ENUM ('Backlog', 'Queued', 'Active', 'Suspended', 'Terminated');

-- CreateEnum
CREATE TYPE "public"."MissionReason" AS ENUM ('Blocked', 'Deprioritized', 'Done', 'Cancelled');

-- AlterTable
ALTER TABLE "public"."missions" ADD COLUMN "state" "public"."MissionState" NOT NULL DEFAULT 'Backlog';
ALTER TABLE "public"."missions" ADD COLUMN "reason" "public"."MissionReason";

-- Data Mapping
UPDATE "public"."missions" SET "state" = 'Backlog' WHERE "status" = 'todo';
UPDATE "public"."missions" SET "state" = 'Active' WHERE "status" = 'in_progress';
UPDATE "public"."missions" SET "state" = 'Terminated', "reason" = 'Done' WHERE "status" = 'done';
