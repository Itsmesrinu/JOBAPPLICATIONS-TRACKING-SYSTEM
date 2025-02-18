import jwt from 'jsonwebtoken'
import User from '../models/User.js';

// Authentication middleware
export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        console.log('Auth Header:', authHeader); // Debug log
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        const token = authHeader.split(' ')[1];
        console.log('Token:', token); // Debug log
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded); // Debug log
        
        const user = await User.findById(decoded.id);
        console.log('Found user:', user); // Debug log

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth error:', error);
        return res.status(401).json({
            success: false,
            message: error.message || 'Invalid token'
        });
    }
};

// Authorization middleware
export const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized - No token provided'
            });
        }

        if (roles.length && !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Forbidden - Insufficient permissions'
            });
        }

        next();
    };
};

// Add role-based authentication
export const authorizeRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this route'
            });
        }
        next();
    };
};