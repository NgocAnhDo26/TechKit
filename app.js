const express = require("express");
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require("path");

dotenv.config();

// Init middlewares
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Database Connection
const sequelize = require('./src/config/database');
sequelize.authenticate()
    .then(() => console.log('MySQL connected...'))
    .catch(err => console.log('Error: ' + err));

// Models and Sync
const Product = require('./src/product/product');

sequelize.sync({ force: false }) // Set `force: true` for resetting tables on startup
    .then(() => console.log('Tables synchronized'))
    .catch(err => console.log(err));

// Server setup
const PORT = process.env.PORT ?? 1111;

const server = app.listen(PORT, () => {
    console.log(`TechKit starts at port ${PORT}`);
});

process.on("SIGINT", () => {
    server.close(() => console.log("Exit Server Express"));
});

// Init routes
var router = require("./src/routes/index.js");
const productRoutes = require('./src/routes/productRoutes');
app.set("views", path.join(__dirname, "src/views"));
app.use("", productRoutes);
app.use("", router);
// Use static files
app.use(express.static("assets"));

// Init database

// Handing errors

module.exports = app;