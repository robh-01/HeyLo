/*
  Warnings:

  - The values [GROUP_MESSAGE,DUO_MESSAGE] on the enum `ChatMessageType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ChatMessageType_new" AS ENUM ('DIRECT', 'GROUP');
ALTER TABLE "ChatMessage" ALTER COLUMN "type" TYPE "ChatMessageType_new" USING ("type"::text::"ChatMessageType_new");
ALTER TYPE "ChatMessageType" RENAME TO "ChatMessageType_old";
ALTER TYPE "ChatMessageType_new" RENAME TO "ChatMessageType";
DROP TYPE "ChatMessageType_old";
COMMIT;
