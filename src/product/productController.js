import express from 'express';
import {
    fetchProductByCategoryID,
    fetchProductByID,
} from './productService.js';

const router = express.Router();

// This will be removed later
router.get('/', async (req, res) => {
    res.render('shop');
});

router.get('/laptop', async (req, res) => {
    var products = await fetchProductByCategoryID(1);
    res.render('shop', { products });
});

router.get('/pc', async (req, res) => {
    var products = await fetchProductByCategoryID(2);
    res.render('shop', { products });
});

router.get('/:category_name/:product_id', async (req, res) => {
    const { category_name, product_id } = req.params;
    var product = await fetchProductByID(product_id);
    res.render('singleProduct', { product });
});

export default router;
