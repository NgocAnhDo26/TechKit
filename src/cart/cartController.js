import express from 'express';
import * as service from './cartService.js';
import { fetchProductByID } from '../product/productService.js';

const router = express.Router();

export const renderCartPage = (req, res) => {
    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);

    if (req.user) {
        service.fetchCartProducts(req.user.id)
            .then((result) => {
                const { totalPrice, totalQuantity, products } = result;
                res.status(200).render('cart', { totalPrice, totalQuantity, products, formatPrice });
            })
            .catch((e) => {
                console.error(e);
                res.status(500).send("Đã xảy ra lỗi khi lấy thông tin giỏ hàng.");
            });
    } else {
        service.fetchGuestCartProducts(req.session.guestCart)
            .then((result) => {
                const { totalPrice, totalQuantity, products } = result;
                res.status(200).render('cart', { totalPrice, totalQuantity, products, formatPrice });
            })
            .catch((e) => {
                console.error(e);
                res.status(500).send("Đã xảy ra lỗi khi lấy thông tin giỏ hàng.");
            });
    }
};

router.post('/', async (req, res) => {
    const { productId, quantity } = req.body;

    if (req.user) {
        service.addProductToCart(req.user.id, parseInt(productId), parseInt(quantity))
            .then((result) => {
                if (result === null) {
                    res.status(400).send("Không còn đủ sản phẩm trong kho.");
                    return;
                }
                res.status(200).json(result);
            })
            .catch((e) => {
                console.error(e);
                res.status(500).send("Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng.");
            });
    } else {
        const product = await fetchProductByID(parseInt(productId));

        if (!product) {
            return res.status(404).send('Không tìm thấy sản phẩm.');
        }

        const existingItem = req.session.guestCart.find(item => item.productId === productId);
        if (existingItem) {
            existingItem.quantity += parseInt(quantity, 10);
        } else {
            req.session.guestCart.push({ productId, quantity: parseInt(quantity, 10) });
        }

        res.status(200).json(req.session.guestCart);
    }
});

router.get("/count", async (req, res) => {
    if (req.user) {
        const count = await service.getCartCount(req.user.id);
        res.status(200).json({ count: count });
    } else {
        res.status(200).json({ count: req.session.guestCart.length });
    }
});

router.delete('/:productId', async (req, res) => {
    const productId = parseInt(req.params.productId, 10);
    if (req.user) {
        service.removeProductFromCart(req.user.id, productId)
            .then((result) => {
                res.status(200).json(result);
            })
            .catch((e) => {
                console.error(e);
                res.status(500).send("Đã xảy ra lỗi khi xóa sản phẩm khỏi giỏ hàng.");
            });
    } else {
        req.session.guestCart = req.session.guestCart.filter(item => item.productId !== productId);

        // Recalculate total price and quantity
        service.fetchGuestCartProducts(req.session.guestCart).then((result) => {
            const { totalPrice, totalQuantity, products } = result;
            res.status(200).json({ totalPrice, totalQuantity, products });
        }).catch((e) => {
            console.error(e);
            res.status(500).send("Đã xảy ra lỗi khi lấy thông tin giỏ hàng.");
        });
    }
});

// Change product quantity in cart
router.put('/:productId', async (req, res) => {
    const quantity = parseInt(req.body.quantity, 10);
    const productId = parseInt(req.params.productId, 10);

    if (req.user) {
        service.updateProductQuantity(req.user.id, productId, quantity)
            .then((result) => {
                if (result === null) {
                    res.status(400).send("Số lượng sản phẩm không hợp lệ hoặc không còn đủ hàng trong kho.");
                    return;
                }
                res.status(200).json(result);
            })
            .catch((e) => {
                console.error(e);
                res.status(500).send("Đã xảy ra lỗi khi cập nhật số lượng sản phẩm.");
            });
    } else {
        const product = req.session.guestCart.find(item => item.productId === productId);
        if (product) {
            product.quantity = quantity;
        }

        // Recalculate total price and quantity
        try {
            const result = await service.fetchGuestCartProducts(req.session.guestCart)
            const { totalPrice, totalQuantity, products } = result;

            // Get product new quantity and total price
            const updatedProduct = products.find(item => item.id === productId);
            const productTotal = updatedProduct.price * quantity;

            res.status(200).json({ totalQuantity, totalPrice, productTotal });
        } catch (e) {
            console.error(e);
            res.status(500).send("Đã xảy ra lỗi khi lấy thông tin giỏ hàng.");
        }
    }
});

// Clear user's cart
router.delete('/', async (req, res) => {
    if (!req.user) {
        req.session.guestCart = [];
        res.status(200).json("Đã xóa giỏ hàng.");
    } else {
        service.clearCart(req.user.id)
            .then((result) => {
                res.status(200).json(result);
            })
            .catch((e) => {
                console.error(e);
                res.status(500).send("Đã xảy ra lỗi khi xóa giỏ hàng.");
            });
    }
});

// Merge guest cart with user cart
export const mergeCart = async (req, userId, guestCart) => {
    try {
        if (guestCart.length > 0) {
            await service.mergeGuestCartWithUserCart(userId, guestCart);
            req.session.guestCart = [];
        }
    } catch (e) {
        console.error(e);
    }
}

export default router;