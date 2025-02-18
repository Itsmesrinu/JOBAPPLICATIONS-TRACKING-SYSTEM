import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate } from '../middleware/VerifyToken.js';
import Application from '../models/Application.js';
import User from '../models/User.js';
import Job from '../models/Job.js';
import { 
    addApplication, 
    getApplication, 
    getApplications,
    updateApplicationStatus,
    getShortlistedCandidates,
    getPendingApplications,
    getRecruiterApplications
} from '../controllers/Application/applicationController.js';
import mongoose from 'mongoose';
import { applicationValidation } from '../middleware/validation.js';
import { fileStorage } from '../config/multerConfig.js';
import { authenticateToken, authenticateUser, protect, authorize } from '../middleware/auth.js';
import { getUserApplications } from '../controllers/Application/getUserApplications.js';
import { checkApplicationStatus } from '../controllers/Application/checkApplicationStatus.js';

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/resumes')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Routes
router.post('/submit-application', 
    authenticateToken, 
    upload.single('resume'), 
    addApplication
);

// Protected routes with role authorization
router.post('/add', authorize(['candidate']), addApplication);
router.get('/:id', authorize(['recruiter', 'coordinator', 'candidate']), getApplication);
router.get('/', authorize(['recruiter', 'coordinator']), getApplications);
router.put('/status/:id', authorize(['recruiter']), updateApplicationStatus);
router.get('/shortlisted', authorize(['recruiter', 'coordinator']), getShortlistedCandidates);
//router.get('/status/:jobId/:candidateId', checkApplicationStatus);

// Get all applications with filters
router.get('/all', authenticate, async (req, res) => {
    try {
        const { status, jobId } = req.query;
        const filter = {};
        
        if (status) filter.status = status;
        if (jobId) filter.jobId = jobId;

        const applications = await Application.find(filter)
            .populate('jobId', 'jobTitle employmentType location')
            .populate('candidateId', 'userName userEmail')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            applications
        });
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch applications'
        });
    }
});

// Submit new application
router.post('/apply', 
    authenticate, 
    upload.single('resume'),
    applicationValidation,
    async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a resume'
            });
        }

        const { jobId, answers } = req.body;

        const application = new Application({
            jobId,
            candidateId: req.user._id,
            resumePath: req.file.path,
            answers: JSON.parse(answers),
            status: 'pending'
        });

        await application.save({ session });

        // Update job with new application
        await Job.findByIdAndUpdate(jobId, {
            $push: { applications: application._id }
        }, { session });

        // Update user's applications
        await User.findByIdAndUpdate(req.user._id, {
            $push: { 
                applications: {
                    jobId,
                    applicationId: application._id,
                    status: 'active'
                }
            }
        }, { session });

        await session.commitTransaction();

        res.status(201).json({
            success: true,
            application
        });
    } catch (error) {
        await session.abortTransaction();
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({
            success: false,
            message: error.message
        });
    } finally {
        session.endSession();
    }
});

// Get pending applications
router.get('/pending', authenticateUser, getPendingApplications);

// Protected routes
router.use(protect);

// Recruiter routes
router.get('/recruiter', authorize(['recruiter']), getRecruiterApplications);
router.get('/:id', authorize(['recruiter', 'coordinator']), getApplication);
router.put('/:id/status', authorize(['recruiter']), updateApplicationStatus);

// Coordinator routes
router.get('/pending', authorize(['coordinator']), getApplications);

// New route for getting user applications
router.get('/user/:userId', getUserApplications);

// New route for checking application status
router.get('/status/:jobId/:candidateId', checkApplicationStatus);

export default router;