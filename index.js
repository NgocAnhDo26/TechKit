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

const pool = require('./src/db/product');

async function initDatabase() {
    try {
        // Get a connection from the pool
        const connection = await pool.getConnection();

        // Test the database connection with a simple query
        const [rows] = await connection.query('SELECT 1');
        console.log('Database connected successfully.');

        // Release the connection back to the pool
        connection.release();
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1); // Exit the process if the database connection fails
    }
}

initDatabase();
// Handing errors

module.exports = app;
