import express from 'express';
import { register as authRegister } from './authService.js';

const router = express.Router();

router.post('/register', authRegister);

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});

export default router;
