use `db-techkit`;

CREATE TABLE category (
  id TINYINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE category_product (
  category_id TINYINT,
  product_id INT,
  PRIMARY KEY (category_id, product_id),
  FOREIGN KEY (category_id) REFERENCES category(id),
  FOREIGN KEY (product_id) REFERENCES product(id)
);

CREATE TABLE brand (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE product (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(70) NOT NULL UNIQUE,
  brand_id INT NOT NULL,
  storage VARCHAR(10) NOT NULL,
  cpu VARCHAR(30) NOT NULL,
  screen_size VARCHAR(20) NOT NULL,
  resolution VARCHAR(50) NOT NULL,
  ram VARCHAR(10) NOT NULL,
  graphic_card VARCHAR(50),
  description TEXT,
  price INT NOT NULL,
  price_sale INT,
  in_stock INT NOT NULL,
  sales INT NOT NULL,
  create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) NOT NULL DEFAULT 'on stock',
  FOREIGN KEY (brand_id) REFERENCES brand(id)
);

CREATE TABLE product_image (
  product_id INT,
  public_id VARCHAR(50),
  is_profile_img BOOL NOT NULL DEFAULT FALSE,
  PRIMARY KEY (product_id, address),
  FOREIGN KEY (product_id) REFERENCES product(id)
);

CREATE TABLE account (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(70) NOT NULL,
  email VARCHAR(254) NOT NULL UNIQUE,
  password VARCHAR(60),
  address VARCHAR(100),
  birthdate DATETIME,
  sex VARCHAR(50),
  avatar VARCHAR(100) NOT NULL,
  create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_lock BOOL NOT NULL,
  is_admin BOOL NOT NULL,
  google_id VARCHAR(100) UNIQUE
);

CREATE TABLE product_review (
  product_id INT,
  account_id INT,
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  content TEXT NOT NULL,
  PRIMARY KEY (product_id, account_id, create_time),
  FOREIGN KEY (product_id) REFERENCES product(id),
  FOREIGN KEY (account_id) REFERENCES account(id)
);

CREATE TABLE cart (
  account_id INT UNIQUE,
  product_id INT,
  quantity INT NOT NULL,
  PRIMARY KEY (account_id, product_id),
  FOREIGN KEY (account_id) REFERENCES account(id),
  FOREIGN KEY (product_id) REFERENCES product(id)
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  account_id INT NOT NULL,
  shipping_address VARCHAR(100),
  create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) NOT NULL,
  FOREIGN KEY (account_id) REFERENCES account(id)
);

CREATE TABLE order_product (
  order_id INT,
  product_id INT,
  quantity INT NOT NULL,
  PRIMARY KEY (order_id, product_id),
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES product(id)
);