import { prisma } from '../config/config.js'; // Import prisma database connection
import { clearCart, fetchCartProducts } from '../cart/cartService.js';

// Create order
export const createOrder = async (userId, order) => {
  const orderDetails = order;
  orderDetails.account_id = userId;
  orderDetails.status = 'Đang xử lý';

  const { totalPrice, products } = await fetchCartProducts(userId);
  orderDetails.total_price = totalPrice;

  let orderId;

  try {
    await prisma.$transaction(async (tx) => {
      // Create the order and retrieve the created order ID
      const createdOrder = await tx.orders.create({
        data: orderDetails,
      });

      orderId = createdOrder.id;

      // Add products to the order_product table
      await Promise.all(
        products.map((product) =>
          tx.order_product.create({
            data: {
              order_id: orderId,
              product_id: product.id,
              quantity: product.quantity,
              price: product.price_sale * product.quantity,
            },
          })
        )
      );

      // Update product in_stock quantity and sales
      // Ensure that the product in_stock > 0 before updating the quantity
      await Promise.all(
        products.map(async (product) => {
          const productData = await tx.product.findUnique({
            where: {
              id: product.id,
            },
          });

          if (productData.in_stock > 0) {
            const newQuantity = productData.in_stock - product.quantity;
            const newSales = productData.sales + product.quantity;

            await tx.product.update({
              where: {
                id: product.id,
              },
              data: {
                in_stock: newQuantity,
                sales: newSales,
              },
            });
          } else {
            throw new Error('Sản phẩm ' + productData.name + ' đã hết hàng. Vui lòng thử lại sau.');
          }
        })
      );

      // Clear the cart
      await clearCart(order.customer_id);
    });

    return { status: 'success', message: 'Đơn hàng đã được tạo thành công!', orderId };
  } catch (e) {
    console.error(e);
    return {
      status: 'failed',
      message: e.message.startsWith('Sản phẩm ') ? e.message : 'Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại sau.',
    };
  }

};

// Fetch all customer's orders
export const fetchOrders = async (customer_id) => {
  return await prisma.orders.findMany({
    where: {
      account_id: customer_id,
    },
  });
};

// Fetch order by ID
export const fetchOrderById = async (order_id) => {
  return await prisma.orders.findUnique({
    where: {
      order_id,
    },
  });
};

// Update order status
export const updateOrderStatus = async (order_id, status) => {
  try {
    await prisma.orders.update({
      where: {
        id: order_id,
      },
      data: {
        status,
      },
    });
  } catch (e) {
    console.error(e);
    return {
      status: 'failed',
      message: 'Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng. Vui lòng thử lại sau.',
    };
  }

  return { status: 'success', message: 'Trạng thái đơn hàng đã được cập nhật thành công!' };
};