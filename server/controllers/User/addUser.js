import User from '../../models/User.js'
import bcrypt from 'bcryptjs';

const addUser = async (req, res) => {
    try {
        const { userName, userEmail, userPassword, gender, address, role } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ userEmail });
        if (existingUser) {
            return res.status(400).json({ 
                success: false,
                message: 'User with this email already exists' 
            });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userPassword, salt);
        
        // Create new user
        const newUser = new User({
            userName,
            userEmail,
            userPassword: hashedPassword,
            gender,
            address,
            role: role || 'candidate' // Default role is candidate
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: {
                userName: newUser.userName,
                userEmail: newUser.userEmail,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error('Add user error:', error);
        res.status(500).json({ 
            success: false,
            message: error.message || 'Failed to create user' 
        });
    }
};

export { addUser };