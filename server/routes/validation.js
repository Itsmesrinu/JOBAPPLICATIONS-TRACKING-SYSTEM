import { body, param, query } from 'express-validator';

export const jobValidation = [
    body('jobTitle').trim().notEmpty().withMessage('Job title is required'),
    body('employmentType').isIn(['Full Time', 'Part Time', 'Contract', 'Internship'])
        .withMessage('Invalid employment type'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('salary').trim().notEmpty().withMessage('Salary is required'),
    body('description').trim().notEmpty().withMessage('Description is required')
];

export const applicationValidation = [
    body('jobId').isMongoId().withMessage('Invalid job ID'),
    body('answers').isArray().withMessage('Answers must be an array')
];

export const userValidation = [
    body('userName').trim().notEmpty().withMessage('Name is required'),
    body('userEmail').isEmail().withMessage('Invalid email'),
    body('userPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['candidate', 'coordinator', 'recruiter', 'employer'])
        .withMessage('Invalid role')
]; 