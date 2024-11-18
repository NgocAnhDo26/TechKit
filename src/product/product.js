const pool = require('../db/init'); // Import database connection pool

// Function to fetch products with category name
async function fetchProductByCategoryID(categoryID) {
    try {
        // Parameterized query to join product and category tables
        const [rows] = await pool.query(
            `SELECT 
                p.product_id, 
                p.name as product_name, 
                p.price, 
                p.description, 
                c.name as category_name
             FROM 
                product p
             JOIN 
                category c 
             ON 
                p.category_id = c.category_id
             WHERE 
                c.category_id = ?`,
            [categoryID]
        );
        if (rows.length === 0) {
            throw new Error(`No products found for category ID ${categoryID}.`);
        }
        return rows; // Return the joined data
    } catch (error) {
        console.error('Error fetching products with categories:', error.message);
        throw error;
    }
}

// Export the function
module.exports = {
    fetchProductByCategoryID,
};
