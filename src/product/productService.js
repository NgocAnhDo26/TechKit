import { prisma } from '../config/config.js'; // Import prisma database connection

// Function to fetch products with filters (query)
async function fetchProductWithQuery(params, query) {
    let filters = { category: { name: params.category } };
    let orderBy = {};
    let page = Number(query.page) || 1;
    let limit = Number(query.limit) || 6;
    let offset = (page - 1) * limit;

    // Filter by keyword search across name and description (OR logic for keywords)
    const keywordFilters = [];
    if (query.keyword) {
        keywordFilters.push(
            { name: { contains: query.keyword } },
            { description: { contains: query.keyword } },
        );
    }

    if (query.brand) {
        const brandList = query.brand.split(',');
        filters.brand = { in: brandList };
    }

    if (query.screen_size) {
        const screenList = query.screen_size.split(',');
        filters.screen_size = { in: screenList };
    }

    // Filter by CPU keywords (OR logic for CPUs)
    const cpuFilters = [];
    if (query.cpu) {
        const cpuKeywords = query.cpu.split(','); // Assuming `cpu` is a comma-separated string
        cpuKeywords.forEach((keyword) => {
            cpuFilters.push({
                cpu: { contains: keyword },
            });
        });
    }

    // Combine CPU and keyword filters using AND logic
    if (cpuFilters.length > 0 && keywordFilters.length > 0) {
        filters.AND = [{ OR: cpuFilters }, { OR: keywordFilters }];
    } else if (cpuFilters.length > 0) {
        filters.OR = cpuFilters;
    } else if (keywordFilters.length > 0) {
        filters.OR = keywordFilters;
    }

    if (query.order) {
        orderBy.price_sale = query.order;
    }

    if (query.minPrice || query.maxPrice) {
        filters.price_sale = {
            gte: query.minPrice ? Number(query.minPrice) : 0,
            lte: query.maxPrice ? Number(query.maxPrice) : 999999999,
        };
    }

    const products = await prisma.product.findMany({
        include: {
            category: true,
            product_image: true,
        },
        orderBy: orderBy,
        where: filters,
    });

    let paginatedProducts = products.slice(offset, offset + limit);
    let totalPage = products.length / limit;
    return { products: paginatedProducts, totalPage: totalPage, currentPage: page};
}

// Function to fetch product by product ID
async function fetchProductByID(productID) {
    const product = await prisma.product.findUnique({
        include: {
            category: true,
            product_image: {
                where: {
                    is_profile_img: true,
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
async function fetchRecentProducts() {
    return await prisma.product.findMany({
        include: {
            category: true, // Include related category data
            product_image: {
                where: {
                    is_profile_img: true,
                },
            },
        },
    });
}

async function fetchMostDiscountedProducts() {
    const products = await prisma.product.findMany({
        include: {
            category: true, // Include related category data
            product_image: {
                where: {
                    is_profile_img: true,
                },
            },
        },
        where: {
            price_sale: { lt: prisma.product.fields.price }, // Sale price less than original price
        },
        orderBy: [
            {
                // Calculate discount percentage and sort by highest
                price_sale: 'asc', // Lower sale price means higher discount
            },
            {
                price: 'desc', // To prioritize products with larger price differences
            },
        ],
        take: 10,
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
                    is_profile_img: true,
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
                    is_profile_img: true,
                },
            },
        },
        take: 4, // Take 4 product
    });

    return products;
}

// Export the function
export {
    fetchProductByID,
    fetchProductWithQuery,
    fetchRecentProducts,
    fetchMostDiscountedProducts,
    fetchProductsByCategory,
    fetchProductByRelevant,
};
