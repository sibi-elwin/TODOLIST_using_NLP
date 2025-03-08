/*
  Warnings:

  - You are about to drop the column `audioUrl` on the `Task` table. All the data in the column will be lost.
  - Made the column `category` on table `Task` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "audioUrl",
ADD COLUMN     "confidence" TEXT,
ADD COLUMN     "priority" TEXT NOT NULL DEFAULT 'medium',
ALTER COLUMN "category" SET NOT NULL,
ALTER COLUMN "category" SET DEFAULT 'errands';

-- CreateIndex
CREATE INDEX "Task_userId_idx" ON "Task"("userId");
