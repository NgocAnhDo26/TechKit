import express from 'express';
import passport, { isEmailExist, sendActivationEmail } from './authService.js';
import { redisClient } from '../config/config.js';
import { addNewAccount } from '../account/accountService.js';
import { mergeCart } from '../cart/cartController.js';

const router = express.Router();

// For AJAX register
router.get('/register', (req, res) => {
    if (req.query.email) {
        // Check if email exists
        return isEmailExist(req.query.email)
            .then((result) => {
                if (result) {
                    return res.json({ error: 'Email already exists' });
                }
                return res.json({ success: true });
            })
            .catch((err) => {
                console.error(err);
                return res
                    .status(500)
                    .json({ success: false, message: 'Internal server error' });
            });
    }
    return res.render('register');
});

// Handle registration
router.post('/register', (req, res, next) => {
    sendActivationEmail(req.body).catch((err) => {
        console.error(err);
        res.status(500).json({
            message: 'There are problems when sending activation email',
        });
    });
});

// Handle account activation
router.get('/activate', async (req, res, next) => {
    const { token } = req.query;
    if (!token) return res.status(400).json({ error: 'Missing token' });

    try {
        const user = await redisClient.json.get(token);
        if (!user)
            return res.status(400).json({ error: 'Invalid or expired token' });

        // Register account
        const { name, email, password } = user;
        const newUser = await addNewAccount(name, email, password);

        // Merge guest cart with user cart
        const guestCart = req.session.guestCart || [];
        await mergeCart(req, user.id, guestCart);

        req.login(newUser, async (err) => {
            if (err) return next(err);

            await redisClient.del(token); // Delete token after registering

            return res.redirect('/');
        });
    } catch (err) {
        next(err);
    }
});

// Render login page
router.get('/login', (req, res) => {
    res.render('login');
});

// Handle login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', async (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            // Authentication failed, send JSON response with error message
            return res.json({ success: false, message: info.message });
        }
        // Save lastUrl before logging in
        const lastUrl = req.session.lastUrl;
        const guestCart = req.session.guestCart || [];

        // Merge guest cart with user cart
        await mergeCart(req, user.id, guestCart);

        req.login(user, async (err) => {
            if (err) return next(err);

            return res.json({
                success: true,
                redirectUrl: lastUrl || '/',
            });
        });
    })(req, res, next);
});

// Handle logout
router.get('/logout', (req, res, next) => {
    const lastUrl = req.session.lastUrl;
    req.logout((err) => {
        if (err) return next(err);
        return res.redirect(lastUrl || '/');
    });
});

export default router;
