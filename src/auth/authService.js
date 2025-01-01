import { prisma, redisClient } from '../config/config.js';
import passport from 'passport';
import { Strategy } from 'passport-local';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

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

export default passport.use(
    new Strategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            const user = await prisma.account.findUnique({
                where: { email: email },
            });

            if (user) {
                const match = await bcrypt.compare(password, user.password);
                if (match) {
                    return done(null, user);
                }
            }

            return done(null, false, {
                message: 'Incorrect email or password.',
            });
        } catch (err) {
            done(err);
        }
    }),
);

export async function sendActivationEmail(user) {
    const token = crypto.randomBytes(32).toString('hex');
    await redisClient.json.set(token, '$', user, { EX: 3600 }); // 1-hour expiry
    const activateLink = `http://localhost:1111/auth/activate?token=${token}`;

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
        to: user.email,
        subject: 'Activate Your TechKit Account',
        text: `Please visit: ${activateLink}`,
    });
}

export async function isEmailExist(email) {
    return await prisma.account.findUnique({
        where: { email: email },
    });
}
