import { prisma } from '../config/config.js'; // Import prisma database connection
import { createOrder, updateOrderStatus } from '../order/orderService.js';

// Handle checkout
export const handleCheckout = async (userId, order) => {
  const response = await createOrder(userId, order);

  // Update order status if the order was created successfully
  if (response.status === 'success') {
    await updateOrderStatus(response.orderId, 'Pending Confirmation');
  }

  return response;
};
