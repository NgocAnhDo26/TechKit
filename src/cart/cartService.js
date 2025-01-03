import { prisma } from '../config/config.js'; // Import prisma database connection
import { getImage } from '../util/util.js'; // Import getImage function

// Get unique product count from user's cart
export async function getCartCount(user_id) {
  const count = await prisma.cart.count({
    where: { account_id: user_id },
  });

  return count;
}

// Get cart quantity + product id from user's cart
export async function getCartItems(user_id) {
  return await prisma.cart.findMany({
    where: { account_id: user_id },
    select: {
      product_id: true,
      quantity: true,
    },
  });
}

// Fetch all products from user's cart
export async function fetchCartProducts(user_id) {
  let products = await prisma.cart.findMany({
    where: { account_id: user_id },
    include: {
      product: {
        include: {
          product_image: {
            select: {
              public_id: true,
            },
            where: {
              is_profile_img: true,
            },
          },
        },
      },
    },
  });

  products = products.map((product) => ({
    id: product.product_id,
    name: product.product.name,
    price: product.product.price,
    price_sale: product.product.price_sale,
    image: getImage(product.product.product_image[0].public_id).url,
    quantity: product.quantity,
    total: product.product.price_sale * product.quantity,
  }));

  const totalPrice = products.reduce((acc, product) => acc + product.total, 0);
  const totalQuantity = products.reduce(
    (acc, product) => acc + product.quantity,
    0,
  );

  return { totalQuantity, totalPrice, products };
}

// Fetch all products from cart of guest user
export async function fetchGuestCartProducts(cart) {
  const products = cart.map(async (item) => {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
      include: {
        product_image: {
          select: {
            public_id: true,
          },
          where: {
            is_profile_img: true,
          },
        },
      },
    });

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      price_sale: product.price_sale,
      image: getImage(product.product_image[0].public_id).url,
      quantity: item.quantity,
      total: product.price_sale * item.quantity,
    };
  });

  const resolvedProducts = await Promise.all(products);

  const totalPrice = resolvedProducts.reduce(
    (acc, product) => acc + product.total,
    0,
  );
  const totalQuantity = resolvedProducts.reduce(
    (acc, product) => acc + product.quantity,
    0,
  );

  return { totalQuantity, totalPrice, products: resolvedProducts };
}

// Add product to user's cart
export async function addProductToCart(user_id, product_id, quantity) {
  // Check if the product in_stock >= quantity
  const productData = await prisma.product.findUnique({
    where: { id: product_id },
  });

  if (!productData || productData.in_stock < quantity) {
    return null;
  }

  // Check if product already exists in user's cart
  const product = await prisma.cart.findUnique({
    where: {
      account_id_product_id: {
        account_id: user_id,
        product_id: product_id,
      },
    },
  });

  // If product already exists in user's cart, update product quantity
  if (product) {
    return await prisma.cart.update({
      where: {
        account_id_product_id: {
          account_id: user_id,
          product_id: product_id,
        },
      },
      data: {
        quantity: product.quantity + quantity,
      },
    });
  }

  // If product does not exist in user's cart, add product to cart
  return await prisma.cart.create({
    data: {
      account_id: user_id,
      product_id,
      quantity,
    },
  });
}

// Remove product from user's cart
export async function removeProductFromCart(user_id, product_id) {
  await prisma.cart.delete({
    where: {
      account_id_product_id: {
        account_id: user_id,
        product_id: product_id,
      },
    },
  });

  // Re-calculate total quantity and total price of products in user's cart
  const products = await fetchCartProducts(user_id);
  return {
    totalQuantity: products.totalQuantity,
    totalPrice: products.totalPrice,
  };
}

// Update product quantity in user's cart
export async function updateProductQuantity(user_id, product_id, quantity) {
  if (!quantity || quantity <= 0) {
    return null;
  }

  // Check if the product in_stock >= quantity
  const productData = await prisma.product.findUnique({
    where: { id: product_id },
  });

  if (!productData || productData.in_stock < quantity) {
    return null;
  }

  // Update product quantity in user's cart and return updated product (including product_id and quantity and total price)
  const product = await prisma.cart.update({
    where: {
      account_id_product_id: {
        account_id: user_id,
        product_id: product_id,
      },
    },
    data: {
      quantity,
    },
    include: {
      product: {
        select: {
          price: true,
          price_sale: true,
        },
      },
    },
  });

  // Calculate total price of updated product
  const total = product.product.price_sale * quantity;

  // Re-calculate total quantity and total price of products in user's cart
  const products = await fetchCartProducts(user_id);
  return {
    totalQuantity: products.totalQuantity,
    totalPrice: products.totalPrice,
    productTotal: total,
  };
}

// Clear user's cart
export async function clearCart(user_id) {
  return await prisma.cart.deleteMany({
    where: { account_id: user_id },
  });
}

// Merge guest cart with user cart
export async function mergeGuestCartWithUserCart(user_id, guestCart) {
  // Get products from user's cart
  const cartItems = await getCartItems(user_id);

  // Merge guest cart with user cart
  guestCart.map((item) => {
    const existingItem = cartItems.find(
      (cartItem) => cartItem.product_id === item.productId,
    );

    // If product already exists in user's cart, update product quantity
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      cartItems.push({
        product_id: item.productId,
        quantity: item.quantity,
      });
    }
  });

  // Save merged cart to the database
  cartItems.forEach(async (item) => {
    await prisma.cart.upsert({
      where: {
        account_id_product_id: {
          account_id: user_id,
          product_id: item.product_id,
        },
      },
      update: {
        quantity: item.quantity,
      },
      create: {
        account_id: user_id,
        product_id: item.product_id,
        quantity: item.quantity,
      },
    });
  });
}
