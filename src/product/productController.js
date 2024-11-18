const Product = require('./product'); // Importing the Sequelize Product model

exports.getAllProducts = async (req, res) => {
    try {
        // Using Sequelize's findAll method to get all products
        const products = await Product.findOne();  
    } catch (err) {
        // Sending an error message if something goes wrong
        res.status(500).send(err.message);
    }
};
