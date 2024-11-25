import express from 'express';
import * as service from './productService.js';

const router = express.Router();

const categories = {
    LAPTOP: 1,
    PC: 2,
};

router.get('/', (req, res) => {
    res.redirect('..');
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
    const product = await service.fetchProductByID(req.params.product_id)
    console.log("single product: ", product)
    const products = await service.fetchProductByRelevant(product)
    res.render('singleProduct', {product, products})
});



export default router;
