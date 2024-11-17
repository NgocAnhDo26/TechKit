const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("", function (req, res, next) {
    res.render("index");
});

// router.get("", (req, res, next) => {
//     return res.status(200).json({
//         message: "Welcome to my server!",
//     });
// });

module.exports = router;