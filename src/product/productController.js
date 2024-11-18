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

router.get('/:category_name/:product_id',async (req, res) => {
    const { category_name, product_id } = req.params;
    var product = await productModel.fetchProductByID(product_id);
    res.render('singleProduct',{product});
});

module.exports = router;
