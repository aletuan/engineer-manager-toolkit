-- CreateEnum
CREATE TYPE "HostingStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "standup_hostings" (
    "id" TEXT NOT NULL,
    "squadId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "HostingStatus" NOT NULL DEFAULT 'SCHEDULED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "standup_hostings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "standup_hostings_squadId_idx" ON "standup_hostings"("squadId");

-- CreateIndex
CREATE INDEX "standup_hostings_memberId_idx" ON "standup_hostings"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "standup_hostings_squadId_date_key" ON "standup_hostings"("squadId", "date");

-- AddForeignKey
ALTER TABLE "standup_hostings" ADD CONSTRAINT "standup_hostings_squadId_fkey" FOREIGN KEY ("squadId") REFERENCES "squads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "standup_hostings" ADD CONSTRAINT "standup_hostings_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "squad_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
