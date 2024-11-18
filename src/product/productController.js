const express = require('express');
const router = express.Router();

const productModel = require('./product');

// This will be removed later
router.get('/', async (req, res) => {
    res.render('shop');
});

router.get('/laptop', async (req, res) => {
    let products = await productModel.fetch();
    res.render('shop', { products });
});

router.get('/pc', async (req, res) => {
    let products = await productModel.fetch();
    res.render('shop', { products });
});

router.get('/single-product', (req, res) => {
    res.render('singleProduct');
});

module.exports = router;
