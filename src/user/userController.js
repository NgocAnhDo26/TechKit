import express from 'express';
import * as service from './userService.js';
import multer from 'multer';
import { fetchOrders } from '../order/orderService.js';
import { uploadImage, getUrl } from '../util/util.js';  
import path from 'path';

const router = express.Router();

const default_avatar_url = getUrl('default')

// Function to fetch account details by ID
async function fetchAccountDetails(req, res) {
    const account_id = req.user.id;

    if (!account_id) {
        return res.status(400).json({
            success: false,
            message: 'Account ID is required',
        });
    }

    try {
        const account = await service.fetchAccountByID(account_id);

        if (!account) {
            return res.status(404).json({
                success: false,
                message: 'Account not found',
            });
        }

        if (account.avatar) {
            const avatar_url = getUrl(account.avatar);
            if (avatar_url) {
                account.avatar_url = avatar_url;
            }
            else {
                account.avatar_url = default_avatar_url;
            }
            account.avatar_url = avatar_url;
        } else {
            account.avatar_url = default_avatar_url;
        }

        res.status(200).json({
            success: true,
            message: 'Account fetched successfully',
            result: account,
        });
    } catch (error) {
        console.error('Error fetching account:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch account',
        });
    }
}


// GET / - Fetch account details by ID
router.get('/', fetchAccountDetails);
router.get('/info',fetchAccountDetails);

// Renders the profile page with account details
export async function renderProfilePage(req, res) {
    try {
        const account = await service.fetchAccountByID(req.user.id);
        if (!account) {
            return res.status(404).send('Account not found');
        }
        if (account.avatar) {
            const avatar_url = getUrl(account.avatar);
            if (avatar_url) {
                account.avatar_url = avatar_url;
            }
            else {
                account.avatar_url = default_avatar_url;
            }
            account.avatar_url = avatar_url;
        } else {
            account.avatar_url = default_avatar_url;
        }
        res.status(200).render('profile', { section: 'info', account });
    } catch (error) {
        console.error('Error fetching account:', error);
        res.status(500).send('Error occured when fetching account');
    }
}

export async function renderOrdersPage(req, res) {
    try {
        const orders = await fetchOrders(req.user.id);
        res.status(200).render('profile', { section: 'orders', orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('Error occured when fetching orders');
    }
}

async function updateProfile(req, res) {
    const { name, address, birthdate, sex, phone } = req.body;
    const account_id = req.user.id;

    if (!account_id) {
        return res.status(400).json({
            success: false,
            message: 'Account ID is required'
        });
    }

    const account = await service.fetchAccountByID(account_id);
    if (!account) {
        return res.status(400).json({ success: false, message: 'User not found' });
    }

    // Validate and handle the sex field
    let validSex = sex;
    if (sex !== 'Nam' && sex !== 'Nữ') {
        validSex = '';
    }

    try {
        const result = await service.updateProfileInfoByID(account_id, { name, address, birthdate, sex: validSex, phone });
        return res.status(200).json(result);
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to update profile'
        });
    }
}

// POST /info - Update profile information
router.post('', updateProfile);

router.post('/info', updateProfile);

router.post('/password', async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const account_id = req.user.id;
    if (!account_id || !newPassword || !oldPassword) {
        return res.status(400).json({ success: false, message: 'Fill all the fields' });
    }

    const match = await service.comparePassword(account_id, oldPassword);
    if (!match) {
        return res.status(401).json({ success: false, message: "Old password is incorrect" })
    }

    if (oldPassword === newPassword) {
        return res.status(401).json({ success: false, message: "New password must be different from old password" })
    }

    if (confirmPassword !== newPassword) {
        return res.status(401).json({ success: false, message: "Confirm password must be the same as new password" })
    }

    try {
        const account = await service.fetchAccountByID(account_id);
        if (!account) {
            return res.status(400).json({ success: false, message: 'User not found' });
        }
        const result = await service.updatePasswordByID(account_id, newPassword);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error in change-password route:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Set up Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');  // Temporary file storage location
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);  // Get the file extension
        const fileName = Date.now() + ext;  // Generate a unique file name
        cb(null, fileName);  // Set the file name
    }
});

const upload = multer({ storage: storage });

router.post('/avatar', upload.single('avatar'), async (req, res) => {
    const account_id = req.user.id;
      // This should now contain the file data
    if (!account_id) {
        return res.status(400).json({
            success: false,
            message: 'Account ID is required',
        });
    }

    // Check if file is uploaded
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: 'Avatar image is required.',
        });
    }

    try {
        // Call your updateAvatarByID function to upload the image and update the database
        const result = await service.updateAvatarByID(account_id, req.file);

        res.status(200).json({
            success: true,
            message: result.message,
            avatar_url: result.avatar_url,  // Return the new avatar URL
        });
    } catch (error) {
        console.error('Error uploading avatar:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while uploading the avatar.',
            error: error.message,
        });
    }
});

export default router;