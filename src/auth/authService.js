import { prisma } from '../config/config.js'; // Import prisma database connection

async function register(req, res) {
    const { email, password, confirmPassword } = req.body;

    if (!password.length || !email.length) {
        return res.render('register', {
            message: 'The fields below must not be empty',
        });
    }

    if (password !== confirmPassword) {
        return res.render('register', {
            message: 'Passwords do not match',
        });
    }

    // get email from db
    if (
        await prisma.account.findFirst({
            where: {
                email: email,
            },
        })
    ) {
        return res.render('register', {
            message: 'That email is already in use',
        });
    }

    await prisma.account.create({
        data: {
            email: email,
            password: password,
        },
    });

    // move to main page
    // return res.render('register', {
    //     message: 'User registered successfully',
    // });
}

export { register };
