-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "reminded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reminderTime" TIMESTAMP(3);
