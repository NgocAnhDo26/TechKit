import express from 'express';
import productController from '../product/productController.js';
import * as productService from '../product/productService.js';
import authController from '../auth/authController.js';

const router = express.Router();

router.get('/', async (req, res) => {
    req.session.visited = true; // To keep session unchanged every time access the website

    const featured_products = await productService.fetchAllFeaturedProducts();
    const sale_products = await productService.fetchAllSaleProducts();
    res.render('index', { featured_products, sale_products });
});

router.get('/about', (req, res) => {
    res.render('about');
});

router.get('/contact', (req, res) => {
    res.render('contact');
});

router.get('/cart', (req, res) => {
    req.user
        ? res.status(200).render('cart')
        : res.status(401).json('You must be logged in!');
});

router.get('/profile', (req, res) => {
    req.user ? res.status(200).json("HI!") : res.status(401).json("You must be logged in!");
});

router.use('/shop', productController);

router.use('/auth', authController);

export default router;
