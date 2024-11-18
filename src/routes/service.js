const express = require('express');
const router = express.Router();
const productController = require('../product/productController');

router.get('/', (req, res) => {
    res.render('index');
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
