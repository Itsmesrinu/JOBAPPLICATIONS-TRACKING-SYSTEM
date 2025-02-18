import { body, validationResult } from 'express-validator';

// Validation middleware
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    next();
};

// User validation rules
export const userValidation = [
    body('userName')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters long'),
    
    body('userEmail')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email format'),
    
    body('userPassword')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    
    body('role')
        .optional()
        .isIn(['candidate', 'employer', 'recruiter', 'coordinator'])
        .withMessage('Invalid role'),
    
    validate
];

// Job validation rules
export const jobValidation = [
    body('jobTitle')
        .trim()
        .notEmpty()
        .withMessage('Job title is required'),
    
    body('employmentType')
        .trim()
        .notEmpty()
        .withMessage('Employment type is required')
        .isIn(['Full Time', 'Part Time', 'Contract', 'Internship'])
        .withMessage('Invalid employment type'),
    
    body('location')
        .trim()
        .notEmpty()
        .withMessage('Location is required'),
    
    body('salary')
        .trim()
        .notEmpty()
        .withMessage('Salary is required'),
    
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required'),
    
    validate
];

// Application validation rules
export const applicationValidation = [
    body('jobId')
        .trim()
        .notEmpty()
        .withMessage('Job ID is required')
        .isMongoId()
        .withMessage('Invalid job ID format'),
    
    body('answers')
        .optional()
        .isArray()
        .withMessage('Answers must be an array'),
    
    validate
]; 