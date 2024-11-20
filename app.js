import express from 'express';
import path from 'path';
import router from './src/routes/index.js';
import { initDatabase } from './src/db/init.js';

const app = express();
const __dirname = import.meta.dirname;

// Init middlewares
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies

// Server setup
const PORT = process.env.PORT ?? 1111;

const server = app.listen(PORT, () => {
    console.log(`TechKit starts at port http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
    server.close(() => console.log('Exit Server Express'));
});

// Init routes
app.use('', router);

// Use static files
app.use(express.static(path.join(__dirname, 'public')));

// Init database
initDatabase();

// Handing errors

export default app;
