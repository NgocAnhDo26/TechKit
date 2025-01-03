import express from 'express';
import productController from '../product/productControllerApi.js';
import cartController from '../cart/cartController.js';
import profileController from '../user/userController.js';

const router = express.Router();

router.use('/product', productController);

router.use('/cart', cartController);

router.use('/profile',profileController);

export default router;
