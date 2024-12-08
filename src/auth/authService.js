import { prisma } from '../config/config.js'; // Import prisma database connection
import passport from 'passport';
import { Strategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { addNewAccount } from '../account/accountService.js';

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

export async function register(userInfo) {
    const { name, email, password, confirmPassword } = userInfo;

    if (!password.length || !email.length) {
        return 'The fields below must not be empty';
    }

    if (password !== confirmPassword) {
        return 'Passwords do not match';
    }

    // Get email from db
    if (isEmailExist(email)) {
        return 'That email is already in use';
    }

    return await addNewAccount(name, email, password);
}

export async function isEmailExist(email) {
    return await prisma.account.findUnique({
        where: {
            email: email,
        },
    });
}
