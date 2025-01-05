import express from 'express';
import * as service from './productService.js';

const router = express.Router();

// Fetch all products with query parameters
router.get('/', (req, res) => {
  console.log(req.query);
  service
    .fetchProductWithQuery(req.params, req.query)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json(e);
    });
});

router.get('/:product_id', (req, res) => {
  service
    .fetchProductByID(Number(req.params.product_id))
    .then((product) => {
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      res.status(200).json(product);
    })
    .catch((e) => {
      console.error(e);
      res
        .status(500)
        .json({ message: 'An error occurred while fetching the product.' });
    });
});

export default router;
