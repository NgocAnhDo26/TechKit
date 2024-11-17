const express = require("express");
const path = require("path");

// Init middlewares
const app = express();
app.set("view engine", "ejs");

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
app.set("views", path.join(__dirname, "src/views"));
app.use("", router);

// Use static files
app.use(express.static("assets"));

// Init database

// Handing errors

module.exports = app;