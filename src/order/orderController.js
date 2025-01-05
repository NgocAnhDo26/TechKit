import express from 'express';
import * as service from './orderService.js';
import { orderStatusText } from '../util/constants.js';

const router = express.Router();

router.get('/:orderId', async (req, res) => {
  const order = await service.fetchOrderById(
    Number(req.user.id),
    parseInt(req.params.orderId, 10),
  );

  if (!order) {
    return res.status(404).render('error', {
      message: 'Không tìm thấy đơn hàng',
      status: 404,
    });
  }

  res.render('orderInfo', { order, orderStatusText });
});

export default router;
