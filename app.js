const express = require('express');
const path = require('path');
const app = express();

require('dotenv').config();

// Init middlewares
const bodyParser = require('body-parser');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Server setup
const PORT = process.env.PORT ?? 1111;

const server = app.listen(PORT, () => {
    console.log(`TechKit starts at port ${PORT}`);
});

process.on('SIGINT', () => {
    server.close(() => console.log('Exit Server Express'));
});

// Init routes
var router = require('./src/routes');
app.use('', router);

// Use static files
app.use(express.static(path.join(__dirname, 'assets')));

// Init database

// Handing errors

module.exports = app;
