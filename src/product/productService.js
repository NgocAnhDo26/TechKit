import pool from '../db/init.js'; // Import database connection pool

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
        return rows; // Return the joined data
    } catch (error) {
        console.error(
            'Error fetching products with categories:',
            error.message
        );
        throw error;
    }
}

// Function to fetch product by product ID
async function fetchProductByID(productID) {
    try {
        // Parameterized query to join product and category tables
        const [rows] = await pool.query(
            `SELECT 
                p.product_id, 
                p.name as product_name, 
                p.price, 
                p.description, 
                p.brand,
                c.name as category_name
             FROM 
                product p
             JOIN 
                category c 
             ON 
                p.category_id = c.category_id
             WHERE 
                p.product_id = ?`, // Use product_id instead of category_id
            [productID]
        );

        return rows[0]; // Return the first row (the product) from the result
    } catch (error) {
        console.error('Error fetching product by ID:', error.message);
        throw error;
    }
}
// Export the function
export {
    fetchProductByCategoryID,
    fetchProductByID,
};
