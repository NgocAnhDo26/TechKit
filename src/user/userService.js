import { cloudinary,prisma } from '../config/config.js';
import bcrypt from 'bcrypt';

async function comparePassword(account_id,password) {
    try {
        const account = await prisma.account.findUnique({
            where: {
                id: account_id
            }
        })
        const match = await bcrypt.compare(password,account.password);
        return match;
    }
    catch (error) {
        console.error('Error comparing password:', error);
        return {message: "Failed to compare password"};
    }
}   

async function fetchAccountByID(account_id) {
    try {
        const account = await prisma.account.findUnique({
            where : {id : Number(account_id)},
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                address: true,
                avatar:true,
                birthdate: true,
                sex: true,
                create_time: true
            }
        })
        if (account && account.birthdate) {
            // Format birthdate to "yyyy-MM-dd"
            const birthdate = new Date(account.birthdate);
            account.birthdate = birthdate.toISOString().split('T')[0];
        }

        return account;
    } catch (error) {
        console.error('Error fetching accounts:', error);
        return {success:false, message: "Failed to fetch account"};
    }
}

async function updateProfileInfoByID(account_id, info) {
    const { name, address, birthdate, sex, phone } = info;
    let formattedBirthdate;
    if (birthdate) {
        // Convert the birthdate string to a Date object
        formattedBirthdate = new Date(`${birthdate}T00:00:00Z`);
    }
    // Check if at least one field is provided
    if (!name && !address && !birthdate && !sex && !phone) {
        return { success: false, message: "At least one field is required to update account" };
    }

    try {
        // Update the account with the provided fields
        const updatedAccount = await prisma.account.update({
            where: { id: Number(account_id) },
            data: {
                name: name || undefined,
                address: address || undefined,
                birthdate: formattedBirthdate || undefined,
                sex: sex || undefined,
                phone: phone || undefined // Adding phone to update
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                address: true,
                birthdate: true,
                sex: true,
                create_time: true
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

async function updateAvatarByID(account_id, file) {
    try {
        // Fetch the account by ID to get the current avatar public_id
        const account = await prisma.account.findUnique({
            where: { id: account_id },
        });

        if (!account) {
            throw new Error('Account not found');
        }

        // If an old avatar exists, delete it from Cloudinary
        if (account.avatar) {
            
            await cloudinary.uploader.destroy(account.avatar);
        }

        // Upload the new avatar image to Cloudinary
        const result = await cloudinary.uploader.upload(file.path, {
            folder: 'avatar', // Folder in Cloudinary where images will be stored
            public_id: account_id.toString(), // Optional: Set public ID based on account ID
        });

        // After successful upload, update the avatar field in the Prisma database
        const updatedAccount = await prisma.account.update({
            where: { id: account_id },
            data: { avatar: result.public_id }, // Update avatar field with new public ID
        });

        return {
            success: true,
            message: 'Avatar updated successfully',
            avatar_url: result.secure_url, // Return the secure Cloudinary URL
        };

    } catch (error) {
        console.error('Error updating avatar:', error);
        throw new Error('Failed to update avatar');
    }
}

export {
    fetchAccountByID,
    updatePasswordByID,
    updateProfileInfoByID,
    comparePassword,
    updateAvatarByID
};