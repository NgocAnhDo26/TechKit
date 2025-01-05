import express from 'express';
import * as service from './orderService.js';

const router = express.Router();

router.get('/:orderId', async (req, res) => {
    const order = await service.fetchOrderById(40, parseInt(req.params.orderId, 10));

    if (!order) {
        return res.status(404).render('error', {
            message: 'Không tìm thấy đơn hàng',
            status: 404,
        });
    }

    res.render('orderInfo', { order });
});

export default router;