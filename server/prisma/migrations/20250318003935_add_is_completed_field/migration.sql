-- AlterTable
ALTER TABLE "incident_rotations" ADD COLUMN     "isCompleted" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "standup_hostings" ADD COLUMN     "isCompleted" BOOLEAN NOT NULL DEFAULT true;
