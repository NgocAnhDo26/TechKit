import express from 'express';
import apiRoute from './api.js';
import serviceRoute from './users.js';

const router = express.Router();

const api = process.env.API;

router.use(`/api`, apiRoute);
router.use('', serviceRoute);

export default router;
