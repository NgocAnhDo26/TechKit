import { prisma } from '../../app.js'; // Import prisma database connection

async function register(req, res) {
    try {
        const { email, password, confirmPassword } = req.body;

        // get email from db
        const [results] = await pool.execute(
            `
            SELECT 
                email 
            FROM 
                customer 
            WHERE 
                email = ?`,
            [email],
        );
        if (results.length > 0) {
            return res.render('register', {
                message: 'That email is already in use',
            });
        } else if (password !== confirmPassword) {
            return res.render('register', {
                message: 'Passwords do not match',
            });
        }

        // insert new account to db
        await pool.execute(
            `
            INSERT INTO customer (email, password)
            VALUES (?, ?)`,
            [email, password],
        );

        return res.render('register', {
            message: 'User registered successfully',
        });
    } catch (error) {
        console.error('An error occurred. Please try again.', error.message);
        return res.render('register', {
            message: 'An error occurred. Please try again.',
        });
    }
}

export { register };
