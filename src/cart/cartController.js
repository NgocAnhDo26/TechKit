import express from 'express';
import * as service from './cartService.js';

const router = express.Router();

router.get('/', async (req, res) => {
    service.fetchCartProducts(req.user.id)
        .then((result) => {
            const { totalPrice, totalQuantity, products } = result;
            const formatPrice = (price) => new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            }).format(price);
            res.status(200).render('cart', { totalPrice, totalQuantity, products, formatPrice });
        })
        .catch((e) => {
            console.error(e);
            res.status(500).json("Error fetching cart products");
        });
});

router.post('/', async (req, res) => {
    const { productId, quantity } = req.body;
    service.addProductToCart(req.user.id, parseInt(productId), parseInt(quantity))
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((e) => {
            console.error(e);
            res.status(500).json("Error adding product to cart");
        });
});

router.delete('/:productId', async (req, res) => {
    service.removeProductFromCart(req.user.id, parseInt(req.params.productId))
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((e) => {
            console.error(e);
            res.status(500).json("Error removing product from cart");
        });
});

// Change product quantity in cart
router.put('/:productId', async (req, res) => {
    const { quantity } = req.body;
    service.updateProductQuantity(req.user.id, parseInt(req.params.productId), parseInt(quantity))
        .then((result) => {
            if (result === null) {
                res.status(400).json("Invalid quantity");
                return;
            }
            res.status(200).json(result);
        })
        .catch((e) => {
            console.error(e);
            res.status(500).json("Error updating product quantity");
        });
});

// Clear user's cart
router.delete('/', async (req, res) => {
    service.clearCart(req.user.id)
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((e) => {
            console.error(e);
            res.status(500).json("Error clearing cart");
        });
});

export default router;