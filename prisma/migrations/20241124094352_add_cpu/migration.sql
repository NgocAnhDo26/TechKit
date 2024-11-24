/*
  Warnings:

  - You are about to drop the column `main_image` on the `image` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `image` DROP COLUMN `main_image`;

-- AlterTable
ALTER TABLE `product` ADD COLUMN `cpu` VARCHAR(30) NULL;
