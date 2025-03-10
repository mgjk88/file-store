/*
  Warnings:

  - A unique constraint covering the columns `[name,folder_id]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Folder` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_folder_id_fkey";

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_user_id_fkey";

-- DropIndex
DROP INDEX "File_folder_id_key";

-- DropIndex
DROP INDEX "File_name_user_id_folder_id_key";

-- DropIndex
DROP INDEX "File_user_id_key";

-- DropIndex
DROP INDEX "Folder_name_user_id_key";

-- DropIndex
DROP INDEX "Folder_user_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "File_name_folder_id_key" ON "File"("name", "folder_id");

-- CreateIndex
CREATE UNIQUE INDEX "Folder_name_key" ON "Folder"("name");

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
