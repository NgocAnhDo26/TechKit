import express from 'express';
import path from 'path';
import router from './src/routes/index.js';
import morgan from 'morgan';
import session from 'express-session';

const app = express();
const __dirname = import.meta.dirname;

// Init middlewares
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies
app.use(morgan('short'));
app.use(express.static(path.join(__dirname, 'public'))); // Use static files
// app.use(session.);
// app.use(passport.initialize());
// app.use(passport.session());

app.use('', router); // Init routes

// Handing errors

const PORT = process.env.PORT ?? 1111; // Server setup

const server = app.listen(PORT, () => {
    console.log(`TechKit starts at port http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
    server.close(() => {
        console.log('Exit Server Express');
        prisma.$disconnect;
    });
});

export default app;
