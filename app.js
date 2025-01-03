import express from 'express';
import path from 'path';
import router from './src/routes/index.js';
import session from 'express-session';
import { RedisStore } from 'connect-redis';
import { redisClient } from './src/config/config.js';
import passport from 'passport';
import { getCartCount } from './src/cart/cartService.js';
import { getUrl } from './src/util/util.js';

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
  // Exclude certain paths or non-GET methods
  const isExcludedPath =
    req.url.startsWith('/auth') ||
    req.url.startsWith('/api') ||
    req.method !== 'GET';

  // Block storing lastUrl if user is not logged in and tries /profile or /admin, or user is not admin for /admin
  const isForbiddenProfileOrAdmin =
    (!req.user && req.url.startsWith('/profile')) ||
    (!req.user?.is_admin && req.url.startsWith('/admin'));

  // Only store if not excluded and not forbidden
  if (!isExcludedPath && !isForbiddenProfileOrAdmin) {
    req.session.lastUrl = req.originalUrl;
  }

  next();
});

// Middleware for initializing guest cart
app.use((req, res, next) => {
  if (!req.session.guestCart) {
    req.session.guestCart = [];
  }

  next();
});

// Set local variables to use in all view engine templates
app.use(async (req, res, next) => {
  res.locals.isAuth = req.user ? true : false;
  res.locals.avatar = req.user ? getUrl(req.user.avatar) : '';

  // Cart count (distinct product count)
  res.locals.cartCount = req.user
    ? await getCartCount(req.user.id)
    : req.session.guestCart.length;

  next();
});

app.use(router); // Init routes

// Handing errors
app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(500)
    .render('error', { message: 'Đã có lỗi xảy ra, vui lòng thử lại sau' });
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
