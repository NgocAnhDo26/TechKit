const express = require('express');
const apiRoute = require('./api');
const serviceRoute = require('./service');
const router = express.Router();

const api = process.env.PORT;

router.use(`${api}`, apiRoute);
router.use('', serviceRoute);

module.exports = router;