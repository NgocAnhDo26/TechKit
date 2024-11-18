const express = require('express');
const router = express.Router();

const productModel = require('./product');

// This will be removed later
router.get('/', async (req, res) => {
    var products = await productModel.fetchProductByCategoryID(1);
    res.render('shop', { products });
})

router.get('/laptop', async (req, res) => {
    var products = await productModel.fetchProductByCategoryID(1);
    res.render('shop', { products });
});

router.get('/pc', async (req, res) => {
    var products = await productModel.fetchProductByCategoryID(2);
    res.render('shop', { products });
});

router.get('/single-product', (req, res) => {
    res.render('singleProduct');
});

module.exports = router;
