CREATE TABLE "product" (
  "product_id" int NOT NULL AUTO_INCREMENT,
  "name" varchar(70) COLLATE utf8mb4_unicode_ci NOT NULL,
  "price" int NOT NULL,
  "brand" varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  "description" longtext COLLATE utf8mb4_unicode_ci,
  "category_id" int DEFAULT NULL,
  "cpu" varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  "price_sale" int DEFAULT NULL,
  "is_featured" tinyint(1) NOT NULL,
  PRIMARY KEY ("product_id"),
  CONSTRAINT "fk_category" FOREIGN KEY ("category_id") REFERENCES "category" ("category_id")
);

CREATE TABLE "image" (
  "image_id" int NOT NULL AUTO_INCREMENT,
  "product_id" int DEFAULT NULL,
  "image_url" varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY ("image_id"),
  CONSTRAINT "fk_product_id" FOREIGN KEY ("product_id") REFERENCES "product" ("product_id")
);

CREATE TABLE "category" (
  "category_id" int NOT NULL AUTO_INCREMENT,
  "name" varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY ("category_id")
);

CREATE TABLE "customer" (
  "customer_id" int NOT NULL AUTO_INCREMENT,
  "email" varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  "password" varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY ("customer_id"),
  UNIQUE KEY "email" ("email")
);

