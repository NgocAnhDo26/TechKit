import { cloudinary, prisma } from '../config/config.js';
import bcrypt from 'bcrypt';

async function fetchAccountByID(account_id) {
    try {
        const account = await prisma.account.findUnique({
            where : {id : Number(account_id)},
            select: {
                id: true,
                name: true,
                email: true,
                address: true,
                birthdate: true,
                sex: true,
                create_time: true
            }
        })
        return account;
    } catch (error) {
        console.error('Error fetching accounts:', error);
        return {success:false, message: "Failed to fetch account"};
    }
}

async function updateProfileInfoByID(account_id, info) {
    const { name, address, birthdate, sex } = info;

    // Check if at least one field is provided
    if (!name && !address && !birthdate && !sex) {
        return {success:false, message: "At least one field is required to update account"};
    }

    try {
        // Update the account with the provided fields
        const updatedAccount = await prisma.account.update({
            where: { id: Number(account_id) },
            data: {
                name: name || undefined,       
                address: address || undefined, 
                birthdate: birthdate || undefined, 
                sex: sex || undefined          
            }
        });

        return { success: true, message: 'Profile updated successfully', result: updatedAccount };
    } catch (error) {
        console.error('Error updating profile:', error);
        throw new Error(error.message || 'Failed to update profile');
    }
}

async function updatePasswordByID(account_id, newPassword) {
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.account.update({
            where: { id: Number(account_id) },
            data: {
                password: hashedPassword
            }
        });
        return {success:true, message: 'Password successfully updated' };
    } catch (error) {
        console.error('Error updating password:', error);
        throw new Error({success:false,message:'Failed to update password'});
    }
}

export {
    fetchAccountByID,
    updatePasswordByID,
    updateProfileInfoByID
};