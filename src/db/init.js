// // import mysql from 'mysql2/promise';
// // import dotenv from '@dotenvx/dotenvx';
// import { PrismaClient } from '@prisma/client';

// // dotenv.config({ path: '.env' });

// // // Create the connection pool. The pool-specific settings are the defaults
// // const pool = mysql.createPool({
// //     port: process.env.DB_PORT,
// //     host: process.env.DB_HOST,
// //     user: process.env.DB_USER,
// //     database: process.env.DB_NAME,
// //     password: process.env.DB_PASSWORD,
// //     waitForConnections: true,
// //     connectionLimit: 10,
// //     maxIdle: 10, // max idle connections, the default value is the same as connectionLimit
// //     idleTimeout: 10000000, // idle connections timeout, in milliseconds, the default value 60000
// //     queueLimit: 0,
// //     enableKeepAlive: true,
// //     keepAliveInitialDelay: 0,
// // });

// export async function initDatabase() {
//     const prisma = new PrismaClient();
//     // try {
//     //     // Get a connection from the pool
//     //     const connection = await pool.getConnection();

//     //     // Test the database connection with a simple query
//     //     const [rows] = await connection.query('SELECT 1');
//     //     console.log('Database connected successfully.');

//     //     // Release the connection back to the pool
//     //     connection.release();
//     // } catch (error) {
//     //     console.log(error);
//     // }
// }

// // export default pool;
// export default prisma;
