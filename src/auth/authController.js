import express from 'express';
import { register as authRegister } from './authService.js';

const router = express.Router();

router.post('/register', authRegister);

export default router;
