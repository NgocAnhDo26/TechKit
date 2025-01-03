import express from 'express';
import productController from '../product/productController.js';
import {renderProfilePage} from '../user/userController.js';
import * as productService from '../product/productService.js';
import authController from '../auth/authController.js';
import { renderCartPage } from '../cart/cartController.js';

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

router.get('/cart', (req, res) => {
    res.set('Cache-Control', 'no-store');
    renderCartPage(req, res);
});

router.get('/profile', (req,res,next) => {
    req.user
        ? next()
        : res.redirect('/auth/login')
}, renderProfilePage);

router.use('/shop', productController);

router.use('/auth', authController);

export default router;
