import User from '../../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const register = async (req, res) => {
    try {
        const {
            userName,
            userEmail,
            userPassword,
            gender,
            address,
            role,
            companyName
        } = req.body;

        // Enhanced validation
        if (!userName || !userEmail || !userPassword) {
            return res.status(400).json({ 
                success: false,
                message: 'Please provide all required fields' 
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userEmail)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        // Check if user exists with better error handling
        const existingUser = await User.findOne({ userEmail });
        if (existingUser) {
            return res.status(400).json({ 
                success: false,
                message: 'User already exists with this email' 
            });
        }

        // Hash password with proper error handling
        const hashPassword = await bcrypt.hash(userPassword, 10);

        // Create new user with all fields
        const newUser = new User({
            userName,
            userEmail,
            userPassword: hashPassword,
            gender: gender || '',
            address: address || '',
            role: role || 'candidate',
            companyName: role === 'employer' ? companyName : '',
            isAssigned: false,
            applications: []
        });
        
        await newUser.save();

        // Log successful registration
        console.log('User registered successfully:', userEmail);

        res.status(201).json({ 
            success: true,
            message: 'User created successfully' 
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Internal server error',
            error: error.message 
        });
    }
}

const login = async (req, res) => {
    try {
        const { userEmail, userPassword } = req.body;

        // Validate input
        if (!userEmail || !userPassword) {
            return res.status(400).json({ 
                success: false,
                message: 'Please provide email and password' 
            });
        }

        // Find user
        const user = await User.findOne({ userEmail }).select('+userPassword');
        if (!user) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(userPassword, user.userPassword);
        if (!isPasswordValid) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }

        // Generate token - Change userId to id
        const token = jwt.sign(
            { id: user._id }, // Changed from userId to id
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.userPassword;

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: userResponse,
            token
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Internal server error',
            error: error.message 
        });
    }
}

const logout = (req, res) => {
    try {
        res.status(200).json({ 
            success: true, 
            message: "Logout successful" 
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Internal server error',
            error: error.message 
        });
    }
}

const validateToken = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
}

export { register, login, logout, validateToken }