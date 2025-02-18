import express from 'express';
import { register, login, logout, validateToken } from '../controllers/Auth/Auth.js';
import { authenticate } from '../middleware/VerifyToken.js';
import User from '../models/User.js';
import { userValidation } from '../middleware/validation.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', authLimiter, userValidation, register);
router.post('/login', authLimiter, login);
router.post('/logout', authenticate, logout);
router.get('/validate', authenticate, validateToken);

router.get('/validuser', authenticate, async (req, res) => {
    try {
        const validuser = await User.findById(req.user._id);
        if (!validuser) {
            return res.status(404).json({ status: 404, message: 'User not found' });
        }
        res.status(200).json({ status: 200, validuser });
    } catch (error) {
        res.status(500).json({ status: 500, error: error.message });
    }
});

export default router;