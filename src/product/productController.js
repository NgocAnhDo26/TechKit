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
    try {
        const product = await service.fetchProductByID(
            Number(req.params.product_id),
        );

        if (!product) {
            return res.render('error', { message: 'Product not found' });
        }

        const categoryId = product.category_id;

        // Fetch related products and exclude the current product by comparing product_id
        const related_products = (
            await service.fetchProductsByCategory(categoryId)
        )
            .filter(
                (relatedProduct) =>
                    relatedProduct.product_id !== product.product_id,
            )
            .slice(0, 4); // Limit to 4 related products

        res.render('singleProduct', { product, related_products });
    } catch (e) {
        console.error(e);
        res.render('error', {
            message: 'An error occurred while fetching the product.',
        });
    }
});

export default router;
