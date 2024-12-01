import express from 'express';
import * as service from './productService.js';

const router = express.Router();

router.get('/', (req, res) => {
    service
        .fetchProductWithQuery(req.params, req.query)
        .then((products) => {
            res.status(200).render('shop', {
                category: req.params.category,
                products,
            });
        })
        .catch((e) => {
            console.log(e);
            res.status(500).json(e);
        });
});

router.get('/:category', async (req, res) => {
    service
        .fetchProductWithQuery(req.params, req.query)
        .then((products) => {
            res.status(200).render('shop', {
                category: req.params.category,
                products,
            });
        })
        .catch((e) => {
            console.log(e);
            res.status(500).json(e);
        });
});

router.get('/:category/:product_id', async (req, res) => {
    try {
        const product = await service.fetchProductByID(req.params.product_id);

        if (!product) {
            return res.render('error', { message: 'Product not found' });
        }

        // Fetch related products and exclude the current product by comparing product_id
        const related_products = await service.fetchProductByRelevant(product);

        res.render('singleProduct', { product, related_products });
    } catch (e) {
        console.error(e);
        res.render('error', {
            message: 'An error occurred while fetching the product.',
        });
    }
});

export default router;
