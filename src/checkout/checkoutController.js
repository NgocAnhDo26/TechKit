import express from 'express';
import { fetchCartProducts } from '../cart/cartService.js';
import { handleCheckout } from './checkoutService.js';

const router = express.Router();

export const renderCheckoutPage = async (req, res) => {
    const cart = await fetchCartProducts(req.user.id);
    function formatPrice(price) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    }
    res.render('checkout', { cart, formatPrice});
};

router.post('/', async (req, res) => {
    const response = await handleCheckout(req.user.id, req.body);
    if (response.status === 'success') {
        res.status(200).json(response);
    } else {
        res.status(500).json(response);
    }
});

export default router;