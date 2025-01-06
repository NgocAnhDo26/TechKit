import { prisma, redisClient } from '../config/config.js';
import passport from 'passport';
import { Strategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { uploadImage } from '../util/util.js';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await prisma.account.findUnique({
    where: { id: id },
  });
  if (!user) {
    done(null, false);
  } else {
    done(null, user);
  }
});

passport.use(
  new Strategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await prisma.account.findUnique({
        where: { email },
      });

      // If user is found and had logged in with local strategy
      if (user && user.password) {
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          return done(null, user);
        }
      }

      return done(null, false, {
        message: 'Sai email hoặc mật khẩu',
      });
    } catch (err) {
      return done(err);
    }
  }),
);

// Google OAuth2.0
export default passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
      state: true, // Use state for CSRF protection
    },
    async (accessToken, refreshToken, profile, done) => {
      const { id, displayName, emails, photos } = profile;
      const email = emails[0].value;
      let avatar = photos[0].value;

      // Check if the user exists with the given email
      let user = await prisma.account.findUnique({
        where: {
          email: email,
        },
      });

      if (!user) {
        // Upload the avatar to cloudinary
        const result = await uploadImage(avatar, 'TechKit/avatar');
        avatar = result.public_id;

        // If the user does not exist, create a new user
        user = await prisma.account.create({
          data: {
            google_id: id,
            name: displayName,
            email: email,
            avatar: avatar,
          },
        });
      } else if (!user.google_id) {
        // Upload the avatar to cloudinary
        uploadImage(avatar, 'TechKit/avatar').then((result) => {
          avatar = result.public_id;
        });
        // If the user exists but does not have a google_id, update the google_id
        user = await prisma.account.update({
          where: {
            email: email,
          },
          data: {
            google_id: id,
            name: displayName,
            avatar: avatar,
          },
        });
      }

      return done(null, user);
    },
  ),
);

export async function sendActivationEmail(user) {
  const token = crypto.randomBytes(32).toString('hex');
  await redisClient.json.set(token, '$', user, { EX: 3600 }); // 1-hour expiry

  const activateLink = `${process.env.ACTIVATE_LINK}/auth/activate?token=${token}`;
  sendMail(
    user.email,
    '[TechKit] Kích hoạt tài khoản TechKit của bạn',
    `Nhấn vào đây để kích hoạt tài khoản: ${activateLink}`,
  );
}

export async function handleForgotPassword(email) {
  const newPassword = crypto.randomBytes(32).toString('hex');
  const hashPassword = await bcrypt.hash(newPassword, 10);

  await prisma.account.update({
    where: { email: email },
    data: { password: hashPassword },
  });

  sendMail(
    email,
    '[TechKit] Mật khẩu mới của bạn',
    `Mật khẩu mới của bạn là: ${newPassword}`,
  );
}

async function sendMail(email, subject, text) {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    service: process.env.MAIL_SERVICE,
    port: process.env.MAIL_PORT,
    secure: process.env.MAIL_SECURE,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: '"TechKit" <no-reply@techkit.com>',
    to: email,
    subject: subject,
    text: text,
  });
}

export function authorize(req, res, next) {
  if (!req.user) {
    return res
      .status(401)
      .render('error', { message: 'Vui lòng đăng nhập trước', status: 401 });
  }
  return next();
}

export function forbidRoute(req, res, next) {
  const isLoggedIn = !!req.user;
  const isLogout = req.path.includes('/logout');

  // Logged in but accessing something other than '/logout'
  // Or not logged in but accessing '/logout'
  if ((isLoggedIn && !isLogout) || (!isLoggedIn && isLogout)) {
    return res
      .status(403)
      .render('error', { message: 'Trang này bị chặn', status: 403 });
  }
  return next();
}
