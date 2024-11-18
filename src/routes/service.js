const express = require('express');
const router = express.Router();
const productController = require('../product/productController');
const productModel = require('../product/product');

router.get('/',async (req, res) => {
    var products = await productModel.fetchProductByCategoryID(1);
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


module.exports = router;
