/*
  Warnings:

  - The `status` column on the `standup_hostings` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropIndex
DROP INDEX "standup_hostings_squadId_date_key";

-- AlterTable
ALTER TABLE "standup_hostings" DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'SCHEDULED';
