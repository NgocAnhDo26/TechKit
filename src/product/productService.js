import { name } from 'ejs';
import { prisma } from '../../app.js'; // Import prisma database connection

// Function to fetch all products
// async function fetchAllProducts(categoryName) {

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

    if (query.cpu) {
        if (query.cpu.constructor === Array) {
            filters.cpu = { in: query.cpu };
        } else {
            filters.cpu = query.cpu;
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
            product_id: productID,
        },
    });

    return product;
}

// Function to fetch all featured products
async function fetchAllFeaturedProducts() {
    const products = await prisma.product.findMany({
        include: {
            category: true, // Include related category data
        },
        where: {
            is_featured: true, // Filter for featured products
        },
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
                price_sale: null
            }
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



// Export the function
export { fetchProductByID, fetchProductWithQuery,fetchAllFeaturedProducts,fetchAllSaleProducts,fetchProductsByCategory };
