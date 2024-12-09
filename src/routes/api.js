import express from 'express';

const router = express.Router();

router.get('/products', (req, res) => {
    res.json(service.fetchProductWithQuery(req.params, req.query));
});

export default router;
