import express from 'express';
import passport, { isEmailExist, register } from './authService.js';

const router = express.Router();

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
                return res.status(500).json({ error: 'Internal server error' });
            });
    }
    return res.render('register');
});

// AuthController.js
router.post('/register', (req, res, next) => {
    register(req.body)
        .then((newUser) => {
            if (typeof newUser === 'string') {
                // Registration error, send error message
                return res
                    .status(400)
                    .json({ success: false, message: newUser });
            }

            // Registration successful
            req.login(newUser, (err) => {
                if (err) {
                    return next(err);
                }
                // Send success response with redirect URL
                return res.json({ success: true, redirectUrl: '/' });
            });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({
                success: false,
                message: 'There are problems when registering',
            });
        });
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res, next) => {
    // Passport.authenticate(): in this case is a customer callback that return a middleware function which accepted parameters (req, res, next)
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            next(err); // Execute middleware function defined in app.js which handled error
        }
        if (!user) {
            // Authentication failed, render login with error message
            // return res.render('login', { message: info.message });
            return res.json({ success: false, message: info.message });
        }
        req.login(user, (err) => {
            if (err) {
                return next(err);
            }
            // Return res.redirect('/');
            return res.json({ success: true, redirectUrl: '/' });
        });
    })(req, res, next);
});

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        return res.redirect('/');
    });
});

export default router;
