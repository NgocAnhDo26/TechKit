import express from 'express';
import * as service from '../product/productService.js';

const router = express.Router();

router.get('/products', async (req, res) => {
    res.json(await service.fetchProductWithQuery(req.params, req.query));
});

export default router;
