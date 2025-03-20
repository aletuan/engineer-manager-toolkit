/*
  Warnings:

  - You are about to drop the `task_comments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "task_comments" DROP CONSTRAINT "task_comments_createdById_fkey";

-- DropForeignKey
ALTER TABLE "task_comments" DROP CONSTRAINT "task_comments_taskId_fkey";

-- DropTable
DROP TABLE "task_comments";
