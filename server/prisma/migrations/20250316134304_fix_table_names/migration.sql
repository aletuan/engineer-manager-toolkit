/*
  Warnings:

  - The values [NOT_STARTED,COMPLETED,BLOCKED] on the enum `TaskStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `assignedAt` on the `role_assignments` table. All the data in the column will be lost.
  - The `status` column on the `rotation_swaps` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `task_assignees` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `task_dependencies` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `task_stakeholders` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `endDate` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `points` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `progress` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `squadId` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `tasks` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `squad_members` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `task_assignees` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `task_dependencies` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `task_stakeholders` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `assignedToId` to the `tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `attachments` to the `tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dueDate` to the `tasks` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `tasks` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "AssigneeRole" ADD VALUE 'REVIEWER';

-- AlterEnum
ALTER TYPE "DependencyType" ADD VALUE 'RELATES_TO';

-- AlterEnum
ALTER TYPE "MemberStatus" ADD VALUE 'ON_LEAVE';

-- AlterEnum
BEGIN;
CREATE TYPE "TaskStatus_new" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE');
ALTER TABLE "tasks" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "tasks" ALTER COLUMN "status" TYPE "TaskStatus_new" USING ("status"::text::"TaskStatus_new");
ALTER TYPE "TaskStatus" RENAME TO "TaskStatus_old";
ALTER TYPE "TaskStatus_new" RENAME TO "TaskStatus";
DROP TYPE "TaskStatus_old";
ALTER TABLE "tasks" ALTER COLUMN "status" SET DEFAULT 'TODO';
COMMIT;

-- DropForeignKey
ALTER TABLE "task_notes" DROP CONSTRAINT "task_notes_authorId_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_createdById_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_squadId_fkey";

-- DropIndex
DROP INDEX "role_assignments_squadId_memberId_roleId_key";

-- AlterTable
ALTER TABLE "role_assignments" DROP COLUMN "assignedAt";

-- AlterTable
ALTER TABLE "roles" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "rotation_swaps" DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "squad_members" ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "position" DROP NOT NULL;

-- AlterTable
ALTER TABLE "stakeholders" ALTER COLUMN "contactName" DROP NOT NULL,
ALTER COLUMN "contactEmail" DROP NOT NULL,
ALTER COLUMN "contactPhone" DROP NOT NULL,
ALTER COLUMN "groupName" DROP NOT NULL;

-- AlterTable
ALTER TABLE "task_assignees" DROP CONSTRAINT "task_assignees_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "task_assignees_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "task_dependencies" DROP CONSTRAINT "task_dependencies_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "task_dependencies_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "task_stakeholders" DROP CONSTRAINT "task_stakeholders_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "task_stakeholders_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "endDate",
DROP COLUMN "points",
DROP COLUMN "progress",
DROP COLUMN "squadId",
DROP COLUMN "startDate",
ADD COLUMN     "assignedToId" TEXT NOT NULL,
ADD COLUMN     "attachments" JSONB NOT NULL,
ADD COLUMN     "dueDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "tags" TEXT[],
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "priority" SET DEFAULT 'MEDIUM',
ALTER COLUMN "status" SET DEFAULT 'TODO';

-- DropEnum
DROP TYPE "SwapStatus";

-- CreateTable
CREATE TABLE "task_comments" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "task_comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "task_comments_taskId_idx" ON "task_comments"("taskId");

-- CreateIndex
CREATE INDEX "task_comments_createdById_idx" ON "task_comments"("createdById");

-- CreateIndex
CREATE INDEX "activity_logs_userId_idx" ON "activity_logs"("userId");

-- CreateIndex
CREATE INDEX "incident_rotations_squadId_idx" ON "incident_rotations"("squadId");

-- CreateIndex
CREATE INDEX "incident_rotations_primaryMemberId_idx" ON "incident_rotations"("primaryMemberId");

-- CreateIndex
CREATE INDEX "incident_rotations_secondaryMemberId_idx" ON "incident_rotations"("secondaryMemberId");

-- CreateIndex
CREATE INDEX "role_assignments_squadId_idx" ON "role_assignments"("squadId");

-- CreateIndex
CREATE INDEX "role_assignments_memberId_idx" ON "role_assignments"("memberId");

-- CreateIndex
CREATE INDEX "role_assignments_roleId_idx" ON "role_assignments"("roleId");

-- CreateIndex
CREATE INDEX "rotation_swaps_rotationId_idx" ON "rotation_swaps"("rotationId");

-- CreateIndex
CREATE INDEX "rotation_swaps_requesterId_idx" ON "rotation_swaps"("requesterId");

-- CreateIndex
CREATE INDEX "rotation_swaps_accepterId_idx" ON "rotation_swaps"("accepterId");

-- CreateIndex
CREATE INDEX "sprint_reports_squadId_idx" ON "sprint_reports"("squadId");

-- CreateIndex
CREATE UNIQUE INDEX "squad_members_email_key" ON "squad_members"("email");

-- CreateIndex
CREATE INDEX "squad_members_squadId_idx" ON "squad_members"("squadId");

-- CreateIndex
CREATE INDEX "squad_members_userId_idx" ON "squad_members"("userId");

-- CreateIndex
CREATE INDEX "task_assignees_taskId_idx" ON "task_assignees"("taskId");

-- CreateIndex
CREATE INDEX "task_assignees_memberId_idx" ON "task_assignees"("memberId");

-- CreateIndex
CREATE INDEX "task_dependencies_taskId_idx" ON "task_dependencies"("taskId");

-- CreateIndex
CREATE INDEX "task_dependencies_dependentTaskId_idx" ON "task_dependencies"("dependentTaskId");

-- CreateIndex
CREATE INDEX "task_notes_taskId_idx" ON "task_notes"("taskId");

-- CreateIndex
CREATE INDEX "task_notes_authorId_idx" ON "task_notes"("authorId");

-- CreateIndex
CREATE INDEX "task_stakeholders_taskId_idx" ON "task_stakeholders"("taskId");

-- CreateIndex
CREATE INDEX "task_stakeholders_stakeholderId_idx" ON "task_stakeholders"("stakeholderId");

-- CreateIndex
CREATE INDEX "tasks_assignedToId_idx" ON "tasks"("assignedToId");

-- CreateIndex
CREATE INDEX "tasks_createdById_idx" ON "tasks"("createdById");

-- CreateIndex
CREATE INDEX "tasks_featureId_idx" ON "tasks"("featureId");

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "squad_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "squad_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_notes" ADD CONSTRAINT "task_notes_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "squad_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_comments" ADD CONSTRAINT "task_comments_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_comments" ADD CONSTRAINT "task_comments_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "squad_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
