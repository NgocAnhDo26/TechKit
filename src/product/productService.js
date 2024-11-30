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

    if (query.status) {
        if (query.status.constructor === Array) {
            filters.status = { in: query.status };
        } else {
            filters.status = query.status;
        }
    }

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
        },
        where: {
            product_id: Number(productID),
        },
    });
    return product;
}

// Function to fetch all featured products   ------  should be replaced by products are on big sale.
async function fetchAllFeaturedProducts() {
    const products = await prisma.product.findMany({
        include: {
            category: true, // Include related category data
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
            brand: singleProduct.brand,
            NOT: { product_id: singleProduct.product_id },
        },
        include: {
            category: {
                select: {
                    name: true,
                },
            },
            image: {
                select: {
                    image_url: true,
                },
            },
        },
        take: 4, // take 4 product
    });

    products.forEach((product) => {
        console.log(
            `product_id: ${product.product_id}, product_name: ${product.name}`,
        );
        console.log(`category_name: ${product.category.name}`);
        product.image.forEach((img) => {
            console.log(`img_url: ${img.image_url}`);
        });
        console.log('\n');
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
