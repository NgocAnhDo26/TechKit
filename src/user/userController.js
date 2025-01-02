import express from 'express';
import * as service from './userService.js';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/password', async (req, res) => {
    const { account_id, oldPassword ,newPassword } = req.body;
    console.log(account_id);
    if (!account_id || !newPassword || !oldPassword) {
        return res.status(400).json({ success: false, message: 'Fill all the fields' });
    }

    const account = await service.fetchAccountByID(account_id);
    if(!account) {
        return res.status(400).json({ success: false, message: 'User not found' });
    }

    const match = await bcrypt.compare(oldPassword, account.password);
    if (!match) {
        return res.status(401).json({success:false, message: "Old password is incorrect" })
    }

    if (oldPassword === newPassword) {
        return res.status(401).json({success:false, message: "New password must be different from old password" })
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