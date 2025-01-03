import express from 'express';
import * as service from './userService.js';
import bcrypt from 'bcrypt';
import { fetchOrders } from '../order/orderService.js';

const router = express.Router();

// GET / - Fetch account details by ID
router.get('/', async (req, res) => {
    const account_id = req.user.id;
    if (!account_id) {
        return res.status(400).json({
            success: false,
            message: 'Account ID is required'
        });
    }

    try {
        const account = await fetchAccountByID(req.user.id);
        if (!account) {
            return res.status(404).json({
                success: false,
                message: 'Account not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Account fetched successfully',
            result: account
        });
    } catch (error) {
        console.error('Error fetching account:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch account'
        });
    }
});

// Renders the profile page with account details
export async function renderProfilePage(req, res) {
    try {
        const account = await service.fetchAccountByID(req.user.id);
        if (!account) {
            return res.status(404).send('Account not found');
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

router.get('/info', async (req, res) => {
    const { account_id } = req.user.id;

    if (!account_id) {
        return res.status(400).json({
            success: false,
            message: 'Account ID is required'
        });
    }

    try {
        const account = await fetchAccountByID(account_id);
        if (!account) {
            return res.status(404).json({
                success: false,
                message: 'Account not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Account fetched successfully',
            result: account
        });
    } catch (error) {
        console.error('Error fetching account:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch account'
        });
    }
});

async function updateProfile(req, res) {
    const { name, address, birthdate, sex, phone } = req.body;
    const account_id = req.user.id;

    if (!account_id) {
        return res.status(400).json({
            success: false,
            message: 'Account ID is required'
        });
    }

    try {
        const result = await service.updateProfileInfoByID(account_id, { name, address, birthdate, sex, phone });
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
    const { account_id, oldPassword, newPassword } = req.body;
    if (!account_id || !newPassword || !oldPassword) {
        return res.status(400).json({ success: false, message: 'Fill all the fields' });
    }

    const account = await service.fetchAccountByID(account_id);
    if (!account) {
        return res.status(400).json({ success: false, message: 'User not found' });
    }

    const match = await bcrypt.compare(oldPassword, account.password);
    if (!match) {
        return res.status(401).json({ success: false, message: "Old password is incorrect" })
    }

    if (oldPassword === newPassword) {
        return res.status(401).json({ success: false, message: "New password must be different from old password" })
    }

    try {
        const result = await service.updatePasswordByID(account_id, newPassword);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error in change-password route:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

export default router;