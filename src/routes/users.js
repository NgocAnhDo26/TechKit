import express from 'express';
import productController from '../product/productController.js';
import * as productService from '../product/productService.js';
import authController from '../auth/authController.js';

const router = express.Router();

router.get('/', async (req, res) => {
    var products = await productService.fetchProductWithQuery(
        { category: 'Laptop' },
        {},
    );
    var featured_products = await productService.fetchAllFeaturedProducts();
    var sale_products = await productService.fetchAllSaleProducts();
    res.render('index', { products, featured_products,sale_products });
});

router.get('/about', (req, res) => {
    res.render('about');
});

router.get('/contact', (req, res) => {
    res.render('contact');
});

router.get('/cart', (req, res) => {
    res.render('cart');
});

router.use('/shop', productController);

router.use('/auth', authController);

export default router;
