const express = require('express');
const mysql = require('mysql2');
const router = express.Router();

// create the connection to database
const db = mysql.createConnection({
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
});
db.connect((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log('MYSQL connected...');
    }
});

module.exports = { router, db };