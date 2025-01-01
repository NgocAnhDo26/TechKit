import { prisma } from '../config/config.js'; // Import prisma database connection

// Fetch all products from user's cart
export async function fetchCartProducts(user_id) {
    let products = await prisma.cart.findMany({
        where: { account_id: user_id },
        include: {
            product: {
                include: {
                    product_image: {
                        select: {
                            url: true,
                        },
                        where: {
                            is_profile_img: true,
                        },
                    }
                }
            }
        },
    });

    products = products.map((product) => {
        return {
            id: product.product_id,
            name: product.product.name,
            price: product.product.price,
            price_sale: product.product.price_sale,
            image: product.product.product_image[0].url,
            quantity: product.quantity,
            total: product.product.price_sale * product.quantity,
        };
    });

    const totalPrice = products.reduce((acc, product) => acc + product.total, 0);
    const totalQuantity = products.reduce((acc, product) => acc + product.quantity, 0);


    return { totalQuantity, totalPrice, products };
}

// Add product to user's cart
export async function addProductToCart(user_id, product_id, quantity) {
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
    return { totalQuantity: products.totalQuantity, totalPrice: products.totalPrice };
}

// Update product quantity in user's cart
export async function updateProductQuantity(user_id, product_id, quantity) {
    if (!quantity || quantity <= 0) {
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
    return { totalQuantity: products.totalQuantity, totalPrice: products.totalPrice, productTotal: total };
}

// Clear user's cart
export async function clearCart(user_id) {
    return await prisma.cart.deleteMany({
        where: { account_id: user_id },
    });
}