import { prisma } from '../../app.js'; // Import prisma database connection

async function register(req, res) {
    const { email, password, confirmPassword } = req.body;

    if (password != confirmPassword) {
        return res.render('register', {
            message: 'Passwords do not match',
        });
    }

    // get email from db
    if (
        await prisma.customer.findFirst({
            where: {
                email: email,
            },
        })
    ) {
        return res.render('register', {
            message: 'That email is already in use',
        });
    }

    await prisma.customer.create({
        data: {
            email: email,
            password: password,
        },
    });

    return res.render('register', {
        message: 'User registered successfully',
    });
}

export { register };
