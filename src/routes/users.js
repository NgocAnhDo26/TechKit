import express from 'express';
import productController from '../product/productController.js';
import * as productService from '../product/productService.js';
import authController from '../auth/authController.js';
import { forbidRoute, authorize } from '../auth/authService.js';
import { renderCartPage } from '../cart/cartController.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const featured_products = await productService.fetchFeatureProducts();
  const sale_products = await productService.fetchBestSellersProducts();
  res.render('index', { featured_products, sale_products });
});

router.get('/about', (req, res) => {
  res.render('about');
});

router.get('/contact', (req, res) => {
  res.render('contact');
});

router.use('/cart', (req, res) => {
  res.set('Cache-Control', 'no-store');
  renderCartPage(req, res);
});

router.get('/profile', authorize, (req, res) => {
  res.status(200).send('Profile page');
});

router.use('/shop', productController);

router.use('/auth', forbidRoute, authController);

export default router;
