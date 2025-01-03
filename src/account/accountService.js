import { prisma } from '../config/config.js';
import bcrypt from 'bcrypt';

export const fetchAccountByQuery = async (query) => {
    const filter = { AND: [] };
    const order = [];
    if (query.name) {
        filter.AND.push = { name: query.name };
    }
    if (query.email) {
        filter.AND.push = { email: query.email };
    }
    if (query.emailOrder) {
        order.push({ email: query.emailOrder });
    }
    if (query.nameOrder) {
        order.push({ name: query.nameOrder });
    }
    if (query.createTimeOrder) {
        order.push({ name: query.createTimeOrder });
    }
    return await prisma.account.findMany({ where: filter, orderBy: order });
};

export async function fetchAccountByEmail(email) {
    return await prisma.account.findUnique({
        where: { email: email },
    });
}

export const addNewAccount = async (name, email, password) => {
    const SALT_ROUNDS = 10;
    const salt = bcrypt.genSaltSync(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);

    return await prisma.account.create({
        data: {
            name: name,
            email: email,
            password: hashedPassword,
        },
    });
};
