import { cloudinary, prisma } from '../config/config.js';
import bcrypt from 'bcrypt';

async function fetchAccountByID(account_id) {
    try {
        const account = await prisma.account.findUnique({
            where : {id : account_id},
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
                address: true,
                birthdate: true,
                sex: true,
                create_time: true
            }
        })
        return account;
    } catch (error) {
        console.error('Error fetching accounts:', error);
        throw new Error('Failed to fetch accounts');
    }
}

async function updatePasswordByID(account_id, newPassword) {
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.account.update({
            where: { id: account_id },
            update: {
                password: hashedPassword
            }
        });
        return { message: 'Password successfully updated' };
    } catch (error) {
        console.error('Error updating password:', error);
        throw new Error(error.message || 'Failed to update password');
    }
}

export {
    fetchAccountByID,
    updatePasswordByID,
};