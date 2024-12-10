import express from 'express';
import * as service from '../product/productService.js'

const router = express.Router();

router.get('/products', (req, res) => {
    service
        .fetchProductWithQuery(req.params, req.query)
        .then((result) => {
            res.json(result);
        })
        .catch((e) => {
            console.log(e);
            res.status(500).json(e);
        });
});

export default router;
