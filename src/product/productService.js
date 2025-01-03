import { prisma } from '../config/config.js'; // Import prisma database connection
import { getImage } from '../util/util.js'; // Import getImage function

export async function fetchProductWithQuery(params, query) {
  let filters = {
    AND: [],
  };

  // Pagination settings
  let page = Number(query.page) || 1;
  let limit = Number(query.limit) || 6;
  let offset = (page - 1) * limit;

  // Keyword search filters
  if (query.keyword) {
    filters.AND.push({
      OR: [
        { name: { contains: query.keyword } },
        { description: { contains: query.keyword } },
      ],
    });
  }

  if (params.category || query.category) {
    filters.AND.push({
      category: {
        name: params.category || query.category,
      },
    });
  }

  if (query.brand) {
    filters.AND.push({ brand: { name: query.brand } });
  }

  if (query.screen_size) {
    const screenList = query.screen_size.split(',');
    filters.AND.push({ screen_size: { in: screenList } });
  }

  // Filter by CPU keywords (OR logic for CPUs)
  if (query.cpu) {
    const cpus = query.cpu.split(','); // Assuming `cpu` is a comma-separated string
    filters.AND.push({
      OR: cpus.map((cpu) => ({ cpu: { contains: cpu } })),
    });
  }

  // Price range filters
  if (query.minPrice || query.maxPrice) {
    filters.AND.push({
      price_sale: {
        gte: query.minPrice ? Number(query.minPrice) : 0,
        lte: query.maxPrice ? Number(query.maxPrice) : Number.MAX_SAFE_INTEGER,
      },
    });
  }

  // Prepare sorting
  let orderBy = {};
  if (query.order) {
    orderBy.price_sale = query.order;
  }

  // Exclude products with 0 stock
  filters.AND.push({
    in_stock: { gt: 0 },
  });

  // Fetch products with average ratings and category names
  const products = await prisma.product.findMany({
    where: filters,
    select: {
      id: true,
      name: true,
      price: true,
      price_sale: true,
      product_image: {
        select: { public_id: true },
        where: { is_profile_img: true },
      },
      category: {
        select: { name: true },
      },
    },
    orderBy: orderBy,
  });

  if (!products.length) {
    return []; // Empty products
  }

  // Process products to include average rating and category names
  const formattedProducts = formatProducts(products);

  // Compute total pages after filtering
  const totalProducts = formattedProducts.length;
  const totalPage = Math.ceil(totalProducts / limit);

  return {
    products: formattedProducts.slice(offset, offset + limit),
    totalPage,
    currentPage: page,
  };
}

// Function to fetch product by product ID
export async function fetchProductByID(productID) {
  // Fetch the product details
  const product = await prisma.product.findUnique({
    where: {
      id: productID,
      in_stock: { gt: 0 },
    },
    include: {
      brand: {
        select: {
          name: true,
        },
      },
      category: {
        select: {
          name: true,
        },
      },
      product_image: {
        select: {
          public_id: true,
        },
        orderBy: {
          is_profile_img: 'desc', // Profile image first
        },
      },
      product_review: {
        select: {
          account: {
            select: {
              name: true,
            },
          },
          create_time: true,
          content: true,
        },
      },
    },
  });

  if (product != null) {
    const formattedProduct = {
      id: product.id,
      name: product.name,
      brand: product.brand.name,
      storage: product.storage,
      cpu: product.cpu,
      screen_size: product.screen_size,
      resolution: product.resolution,
      ram: product.ram,
      graphic_card: product.graphic_card,
      description: product.description,
      price: product.price,
      price_sale: product.price_sale,
      in_stock: product.in_stock,
      sales: product.sales,
      create_time: product.create_time,
      category: product.category.name,
      profile_img: getImage(product.product_image[0].public_id),
      other_img: product.product_image
        .slice(1)
        .map((item) => getImage(item.public_id)),
      product_review: product.product_review.map((item) => ({
        username: item.account.username,
        create_time: item.create_time,
        content: item.content,
      })),
    };
    return formattedProduct;
  }
  return null; // Empty product
}

export async function fetchBestSellersProducts() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      price: true,
      price_sale: true,
      product_image: {
        select: { public_id: true },
        where: { is_profile_img: true },
      },
      category: {
        select: { name: true },
      },
    },
    where: {
      in_stock: { gt: 0 }, // Only products that are in stock
    },
    orderBy: {
      sales: 'desc', // The most sale products
    },
    take: 12,
  });
  return formatProducts(products);
}

export async function fetchFeatureProducts() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      price: true,
      price_sale: true,
      product_image: {
        select: { public_id: true },
        where: { is_profile_img: true },
      },
      category: {
        select: { name: true },
      },
    },
    where: {
      in_stock: { gt: 0 }, // Only products that are in stock
    },
    orderBy: {
      create_time: 'desc', // The newest products
    },
    take: 12,
  });
  return formatProducts(products);
}

// Related products are products that have the same category or brand
export async function fetchProductByRelevant(singleProduct) {
  const products = await prisma.product.findMany({
    where: {
      NOT: { id: singleProduct.id },
      OR: [
        { category: { name: singleProduct.category.name } },
        { brand: { name: singleProduct.brand } },
      ],
      in_stock: { gt: 0 },
    },
    select: {
      id: true,
      name: true,
      price: true,
      price_sale: true,
      product_image: {
        select: { public_id: true },
        where: { is_profile_img: true },
      },
      category: {
        select: { name: true },
      },
    },
    take: 4, // Take 4 product
  });

  return formatProducts(products);
}

function formatProducts(products) {
  return products.map((product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    price_sale: product.price_sale,
    profile_img: getImage(product.product_image[0].public_id),
    category: product.category.name,
  }));
}
