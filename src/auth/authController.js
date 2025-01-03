import express from 'express';
import passport, {
    handleForgotPassword,
    sendActivationEmail,
} from './authService.js';
import { redisClient } from '../config/config.js';
import {
    addNewAccount,
    fetchAccountByEmail,
} from '../account/accountService.js';

const router = express.Router();

// For AJAX register
router.get('/register', (req, res) => {
    if (req.query.email) {
        // Check if email exists
        return fetchAccountByEmail(req.query.email)
            .then((result) => {
                if (result) {
                    return res
                        .status(400)
                        .json({ error: 'Email already exists' });
                }
                return res.status(200).json({ success: true });
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
        .then(() => res.status(200).json({ success: true }))
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
            return res
                .status(400)
                .json({ success: false, message: info.message });
        }
        // Save lastUrl before logging in
        const lastUrl = req.session.lastUrl;
        req.login(user, (err) => {
            if (err) return next(err);
            return res.status(200).json({
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

router.get('/google/callback', (req, res, next) => {
    passport.authenticate('google', (err, user) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            // Authentication failed
            return res.redirect('/login');
        }

        // Save lastUrl before logging in
        const lastUrl = req.session.lastUrl;
        req.login(user, (err) => {
            if (err) return next(err);
            return res.redirect(lastUrl || '/');
        });
    })(req, res, next);
});

// Render forgot password page
router.get('/forgot-password', (req, res) => {
    res.render('forgotPassword');
});

// Handle login
router.post('/forgot-password', (req, res) => {
    fetchAccountByEmail(req.body.email)
        .then((user) => {
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: 'Email not found',
                });
            }
            handleForgotPassword(user.email).then(() =>
                res.status(200).json({ success: true }),
            );
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        });
});

// Handle logout
router.get('/logout', (req, res, next) => {
    const forbiddenPaths = ['/profile/', '/admin/']; // Prevent redirect to these paths after logout
    const lastUrl = forbiddenPaths.some((path) =>
        path.includes(req.session.lastUrl),
    )
        ? '/'
        : req.session.lastUrl;
    req.logout((err) => {
        if (err) return next(err);
        return res.redirect(lastUrl);
    });
});

export default router;
