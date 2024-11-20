import express from 'express';
import productController from '../product/productController.js';
import {
    fetchProductByCategoryID,
    fetchProductByID,
} from '../product/productService.js';
import authController from '../auth/authController.js';

const router = express.Router();

router.get('/', async (req, res) => {
    var products = await fetchProductByCategoryID(1);
    res.render('index', { products });
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

router.get('/register', (req, res) => {
    res.render('register');
});

router.use('/shop', productController);

router.use('/auth', authController);

export default router;
