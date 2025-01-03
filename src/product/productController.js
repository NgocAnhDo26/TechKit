import express from 'express';
import * as service from './productService.js';

const router = express.Router();

// Fetch all products with query parameters
router.get('/', (req, res) => {
  service
    .fetchProductWithQuery(req.params, req.query)
    .then((result) => {
      res.status(200).render('shop', {
        category: req.params.category,
        products: result.products,
        totalPage: result.totalPage,
        currentPage: result.currentPage,
      });
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json(e);
    });
});

router.get('/:category', (req, res) => {
  service
    .fetchProductWithQuery(req.params, req.query)
    .then((result) => {
      res.status(200).render('shop', {
        category: req.params.category,
        products: result.products,
        totalPage: result.totalPage,
        currentPage: result.currentPage,
      });
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json(e);
    });
});

// Fetch single product by product_id
router.get('/:category_id/:product_id', async (req, res) => {
  try {
    const product = await service.fetchProductByID(
      Number(req.params.product_id),
    );

    if (!product) {
      return res.render('error', { message: 'Không tìm thấy sản phẩm' });
    }

    // Fetch related products and exclude the current product by comparing product_id
    const related_products = await service.fetchProductByRelevant(product);

    res.render('singleProduct', { product, related_products });
  } catch (e) {
    console.error(e);
    res.render('error', {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
    });
  }
});

export default router;
