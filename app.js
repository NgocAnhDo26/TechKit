const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

require('dotenv').config({ path: '.env' });

// Init middlewares
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

app.use(bodyParser.urlencoded({ extended: false })); // Parse URL-encoded bodies
app.use(bodyParser.json()); // Parse JSON bodies

// Server setup
const PORT = process.env.PORT ?? 1111;

const server = app.listen(PORT, () => {
    console.log(`TechKit starts at port http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
    server.close(() => console.log('Exit Server Express'));
});

// Init routes
let router = require('./src/routes');
const exp = require('constants');
app.use('', router);

// Use static files
app.use(express.static(path.join(__dirname, 'assets')));

// Init database
const { router: dbRouter } = require('./src/db/init');
app.use('', dbRouter);
app.use('/auth', require('./src/routes/auth'));

// Handing errors

module.exports = app;
