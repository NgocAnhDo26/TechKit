import express from 'express';
import productController from '../product/productControllerApi.js';
import cartController from '../cart/cartController.js';

const router = express.Router();

router.use('/product', productController);

router.use('/cart', cartController);

export default router;
