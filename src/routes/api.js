import express from 'express';
import productController from '../product/productControllerApi.js';
import cartController from '../cart/cartController.js';
import profileController from '../user/userController.js';
import checkoutController from '../checkout/checkoutController.js';

const router = express.Router();

router.use('/product', productController);

router.use('/cart', cartController);

router.use('/profile', profileController);

router.use('/checkout', (req, res, next) => {
    req.user
        ? next()
        : res.redirect('/auth/login');
}, checkoutController);

export default router;
