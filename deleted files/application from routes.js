import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate } from '../middleware/VerifyToken.js';
import Application from '../models/Application.js';
import User from '../models/User.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/resumes');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
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

const handleUpload = upload.single('resume');

// Application submission route
router.post('/apply', authenticate, handleUpload, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a resume'
            });
        }

        const { jobId } = req.body;
        if (!jobId) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({
                success: false,
                message: 'Job ID is required'
            });
        }

        const application = new Application({
            jobId,
            candidateId: req.user._id,
            resumePath: req.file.path,
            status: 'pending'
        });

        await application.save();

        res.status(200).json({
            success: true,
            message: 'Application submitted successfully',
            application: {
                id: application._id,
                status: application.status,
                submittedAt: application.createdAt
            }
        });
    } catch (error) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to submit application'
        });
    }
});

// Get application status
router.get('/status/:applicationId', authenticate, async (req, res) => {
    try {
        const application = await Application.findById(req.params.applicationId);
        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        // Check if user is authorized to view this application
        if (application.candidateId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized to view this application'
            });
        }

        res.status(200).json({
            success: true,
            application: {
                id: application._id,
                status: application.status,
                submittedAt: application.createdAt,
                updatedAt: application.updatedAt
            }
        });
    } catch (error) {
        console.error('Error fetching application status:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch application status'
        });
    }
});

// Update application status
router.put('/update-status', authenticate, async (req, res) => {
    try {
        const { applicationId, recruiterId, status } = req.body;

        // Update application status
        const updatedApplication = await Application.findByIdAndUpdate(
            applicationId,
            { status },
            { new: true }
        );

        if (!updatedApplication) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        // If approved, update recruiter status
        if (status === 'approved') {
            await User.findByIdAndUpdate(recruiterId, {
                isAssigned: true,
                assignedApplications: [
                    ...(await User.findById(recruiterId)).assignedApplications || [],
                    applicationId
                ]
            });
        }

        res.status(200).json({
            success: true,
            message: `Application ${status} successfully`,
            application: updatedApplication
        });
    } catch (error) {
        console.error('Error updating application status:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update application status'
        });
    }
});

export default router; 