import express from 'express';
import productController from '../product/productController.js';
import * as productService from '../product/productService.js';
import authController from '../auth/authController.js';
import cartController from '../cart/cartController.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const featured_products = await productService.fetchRecentProducts();
    const sale_products = await productService.fetchMostDiscountedProducts();
    res.render('index', { featured_products, sale_products });
});

router.get('/about', (req, res) => {
    res.render('about');
});

router.get('/contact', (req, res) => {
    res.render('contact');
});

router.use('/cart', (req, res, next) => {
    req.user
        ? next()
        : res.status(401).json('You must be logged in!');
}, cartController);

router.get('/profile', (req, res) => {
    req.user
        ? res.status(200).json('HI!')
        : res.status(401).json('You must be logged in!');
});

router.use('/shop', productController);

router.use('/auth', authController);

export default router;
