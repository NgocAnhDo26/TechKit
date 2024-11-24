-- CreateTable
CREATE TABLE `category` (
    `category_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NOT NULL,

    PRIMARY KEY (`category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customer` (
    `customer_id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(254) NOT NULL,
    `password` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`customer_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `image` (
    `image_id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` VARCHAR(15) NOT NULL,
    `image_url` VARCHAR(100) NOT NULL,
    `main_image` TINYINT NOT NULL DEFAULT 0,

    INDEX `fk_product_id_idx`(`product_id`),
    PRIMARY KEY (`image_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product` (
    `product_id` VARCHAR(15) NOT NULL,
    `name` VARCHAR(70) NOT NULL,
    `price` INTEGER NOT NULL,
    `brand` VARCHAR(30) NULL,
    `description` LONGTEXT NULL,
    `category_id` INTEGER NULL,

    INDEX `fk_category_idx`(`category_id`),
    PRIMARY KEY (`product_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `image` ADD CONSTRAINT `fk_product_id` FOREIGN KEY (`product_id`) REFERENCES `product`(`product_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `fk_category` FOREIGN KEY (`category_id`) REFERENCES `category`(`category_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

