import { prisma } from '../config/config.js'; // Import prisma database connection
import passport from 'passport';
import { Strategy } from 'passport-local';

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
            if (!user) {
                return done(null, false, {
                    message: 'Incorrect email address.',
                });
            }
            if (user.password !== password) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        } catch (err) {
            done(err);
        }
    }),
);

export async function register(userInfo) {
    const { name, email, password, confirmPassword } = userInfo;

    if (!password.length || !email.length) {
        return 'The fields below must not be empty';
    }

    if (password !== confirmPassword) {
        return 'Passwords do not match';
    }

    // Get email from db
    if (
        await prisma.account.findUnique({
            where: {
                email: email,
            },
        })
    ) {
        return 'That email is already in use';
    }

    return await prisma.account.create({
        data: {
            name: name,
            email: email,
            password: password,
        },
    });
}
