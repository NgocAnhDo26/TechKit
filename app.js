import express from 'express';
import path from 'path';
import router from './src/routes/index.js';
import session from 'express-session';
import { RedisStore } from 'connect-redis';
import { redisClient } from './src/config/config.js';
import passport from 'passport';
import { getUrl } from './src/account/accountService.js';

const app = express();
const __dirname = import.meta.dirname;

// Init middlewares
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies
app.use(express.static(path.join(__dirname, 'public'))); // Use static files
app.use(
    session({
        store: new RedisStore({ client: redisClient }), // Store session in memory in 1 day using redis
        secret: JSON.parse(process.env.SECRET),
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 60000 * 60, // Cookie live for 1 hour
        },
    }),
);
app.use(passport.initialize());
app.use(passport.session());

// Middleware to save last visited URL
app.use((req, res, next) => {
    // Don't store url for authentication (login, register, logout) or other method except GET
    if (!req.url.startsWith('/auth') && req.method === 'GET') {
        req.session.lastUrl = req.originalUrl;
    }
    next();
});

// Set local variables to use in all view engine templates
app.use((req, res, next) => {
    res.locals.isAuth = req.user ? true : false;
    res.locals.avatar = req.user ? getUrl(req.user.avatar) : '';
    next();
});

app.use(router); // Init routes

// Handing errors
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT ?? 1111; // Server setup

const server = app.listen(PORT, () => {
    console.log(`TechKit starts at port http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
    server.close(() => {
        console.log('Exit Server Express');
    });
});

export default app;
