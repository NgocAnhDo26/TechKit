import express from 'express';
import passport, { isEmailExist, sendActivationEmail } from './authService.js';
import { redisClient } from '../config/config.js';
import { addNewAccount } from '../account/accountService.js';

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
    sendActivationEmail(req.body)
        .then(() => res.json({ success: true }))
        .catch((err) => {
            console.error(err);
            res.status(500).json({
                message: 'There are problems when sending activation email',
            });
        });
});

// Handle account activation
router.get('/activate', async (req, res, next) => {
    const { token } = req.query;
    if (!token) return res.status(400).send('Missing token');

    try {
        const user = await redisClient.json.get(token);
        if (!user) return res.status(400).send('Invalid or expired token');

        // Register account
        const { name, email, password } = user;
        const newUser = await addNewAccount(name, email, password);

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
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            // Authentication failed
            return res.json({ success: false, message: info.message });
        }
        // Save lastUrl before logging in
        const lastUrl = req.session.lastUrl;
        req.login(user, (err) => {
            if (err) return next(err);
            return res.json({
                success: true,
                redirectUrl: lastUrl || '/',
            });
        });
    })(req, res, next);
});

router.get(
    '/google',
    passport.authenticate('google', {
        prompt: 'select_account', // Force to select account
        scope: ['email', 'profile'],
    }),
);

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        console.log(req.session);
        // Successful authentication, redirect last url or home page
        res.redirect(req.session.lastUrl || '/');
    },
);

// Handle logout
router.get('/logout', (req, res, next) => {
    const lastUrl = req.session.lastUrl;
    req.logout((err) => {
        if (err) return next(err);
        return res.redirect(lastUrl || '/');
    });
});

export default router;
