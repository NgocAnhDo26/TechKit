import { prisma } from '../config/config.js'; // Import prisma database connection

// Function to fetch products with filters (query)
async function fetchProductWithQuery(params, query) {
    let filters = { category: { name: params.category } };
    let orderBy = {};

    if (query.keyword) {
        filters.OR = [
            { name: { contains: query.keyword } },
            {
                description: {
                    contains: query.keyword,
                },
            },
        ];
    }

    if (query.brand) {
        if (query.brand.constructor === Array) {
            filters.brand = { in: query.brand };
        } else {
            filters.brand = query.brand;
        }
    }

    // if (query.status) {
    //     if (query.status.constructor === Array) {
    //         filters.status = { in: query.status };
    //     } else {
    //         filters.status = query.status;
    //     }
    // }

    if (query.order) {
        orderBy.price = query.order;
    }

    if (query.minPrice || query.maxPrice) {
        filters.price = {
            gte: query.minPrice ? Number(query.minPrice) : 0,
            lte: query.maxPrice ? Number(query.maxPrice) : 999999999,
        };
    }

    const products = await prisma.product.findMany({
        include: {
            category: true,
            product_image: {
                where: {
                    is_profile_img: 1,
                },
            },
        },
        orderBy,
        where: filters,
    });

    return products;
}

// Function to fetch product by product ID
async function fetchProductByID(productID) {
    const product = await prisma.product.findUnique({
        include: {
            category: true,
            product_image: {
                where: {
                    is_profile_img: 1,
                },
            },
        },
        where: {
            id: Number(productID),
        },
    });
    return product;
}

// Function to fetch all featured products   ------  should be replaced by products are on big sale.
async function fetchAllFeaturedProducts() {
    const products = await prisma.product.findMany({
        include: {
            category: true, // Include related category data
            product_image: {
                where: {
                    is_profile_img: 1,
                },
            },
        },
        // where: {
        //     is_featured: true, // Filter for featured products
        // },
    });

    return products;
}

async function fetchAllSaleProducts() {
    const products = await prisma.product.findMany({
        include: {
            category: true, // Include related category data
            product_image: {
                where: {
                    is_profile_img: 1,
                },
            },
        },
        where: {
            NOT: {
                price_sale: null,
            },
        },
    });

    return products;
}

// Function to fetch products by category ID
async function fetchProductsByCategory(categoryId) {
    const products = await prisma.product.findMany({
        include: {
            category: true, // Include related category data
            product_image: {
                where: {
                    is_profile_img: 1,
                },
            },
        },
        where: {
            category_id: categoryId, // Filter by category_id
        },
    });

    return products;
}

async function fetchProductByRelevant(singleProduct) {
    const products = await prisma.product.findMany({
        where: {
            category: {
                id: singleProduct.category.id,
            },
            NOT: { id: singleProduct.id },
        },
        include: {
            category: {
                select: {
                    name: true,
                },
            },
            product_image: {
                select: {
                    url: true,
                },
                where: {
                    is_profile_img: 1,
                },
            },
        },
        take: 4, // take 4 product
    });

    return products;
}

// Export the function
export {
    fetchProductByID,
    fetchProductWithQuery,
    fetchAllFeaturedProducts,
    fetchAllSaleProducts,
    fetchProductsByCategory,
    fetchProductByRelevant,
};
