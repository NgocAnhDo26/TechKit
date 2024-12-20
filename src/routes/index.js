import express from 'express';
import apiRoute from './api.js';
import serviceRoute from './users.js';

const router = express.Router();

router.use(`/api`, apiRoute);
router.use('', serviceRoute);

export default router;
