import User from '../../models/User.js';
import bcrypt from 'bcryptjs';

export const register = async (req, res) => {
    try {
        const { userName, userEmail, userPassword, role, companyName } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ userEmail });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userPassword, salt);

        // Create new user
        const newUser = new User({
            userName,
            userEmail,
            userPassword: hashedPassword,
            role,
            companyName: role === 'employer' ? companyName : ''
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: 'Registration successful'
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}; 