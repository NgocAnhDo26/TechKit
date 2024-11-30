import express from 'express';
import { register } from './authService.js';
import passport from './authService.js';
import { getUrl } from '../account/accountService.js';

const router = express.Router();

router.post('/register', (req, res, next) => {
    register(req.body)
        .then((newUser) => {
            if (typeof newUser === 'string') {
                return res.render('register', { message: newUser });
            }
            console.log(newUser);
            // register successfully
            req.login(newUser, (err) => {
                if (err) {
                    return next(err);
                }
                return res.redirect('/');
            });
        })
        .catch((err) => {
            console.err(err);
            res.status(500).send('There are problems when registering');
        });
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res, next) => {
    // passport.authenticate(): in this case is a customer callback that return a middleware function which accepted parameters (req, res, next)
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            next(err); // execute middleware function defined in app.js which handled error
        }
        if (!user) {
            // Authentication failed, render login with error message
            return res.render('login', { message: info.message });
        }
        req.login(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.redirect('/');
        });
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        return res.redirect('/');
    });
});

export default router;
