import express from 'express';
import { authenticate, authorizeRole } from '../middleware/VerifyToken.js';
import { 
    addJob, 
    getJobs, 
    getJob, 
    updateJob, 
    deleteJob,
    updateJobByCandidate 
} from '../controllers/Job/index.js';
import { jobValidation } from '../middleware/validation.js';
import Job from '../models/Job.js';
import User from '../models/User.js';
import RecruiterAssignment from '../models/Recruiter.js';
import mongoose from 'mongoose';
import { getShortlistedCandidates, updateApplicationStatus } from '../controllers/Application/index.js';
import { getPendingJobs } from '../controllers/Job/getPendingJobs.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/all-jobs', getJobs);
router.get('/current-job/:id', getJob);

// Protected routes
router.post('/post-job', authenticate, jobValidation, addJob);
router.put('/update-job/:id', authenticate, jobValidation, updateJob);
router.put('/update-job-by-candidate/:id', authenticate, updateJobByCandidate);
router.delete('/delete-job/:id', authenticate, deleteJob);

// Get job by ID with all related data
router.get('/current-job/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('employerId', 'userName companyName')
            .populate('recruiterID', 'userName userEmail')
            .populate({
                path: 'applications',
                populate: {
                    path: 'candidateId',
                    select: 'userName userEmail'
                }
            });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        res.status(200).json({
            success: true,
            job
        });
    } catch (error) {
        console.error('Error fetching job:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch job details'
        });
    }
});

// Get pending jobs for coordinator
router.get('/pending-jobs', authenticate, authorizeRole('coordinator'), async (req, res) => {
    try {
        const jobs = await Job.find({ 
            status: 'pending',
            recruiterID: null,
            isAssigned: false
        })
        .populate('employerId', 'userName companyName')
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            jobs
        });
    } catch (error) {
        console.error('Error fetching pending jobs:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch pending jobs'
        });
    }
});

// Assign recruiter to job
router.post('/assign-recruiter', authenticate, authorizeRole('coordinator'), async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { jobId, recruiterId } = req.body;

        // Update job
        const job = await Job.findByIdAndUpdate(
            jobId,
            {
                recruiterID: recruiterId,
                status: 'active',
                isAssigned: true,
                updatedAt: Date.now()
            },
            { new: true, session }
        ).populate('employerId recruiterID');

        if (!job) {
            throw new Error('Job not found');
        }

        // Update recruiter status
        await User.findByIdAndUpdate(
            recruiterId,
            { isAssigned: true },
            { session }
        );

        // Create recruiter assignment record
        const recruiterAssignment = new RecruiterAssignment({
            jobId,
            recruiterId,
            status: 'active'
        });
        await recruiterAssignment.save({ session });

        await session.commitTransaction();

        res.status(200).json({
            success: true,
            message: 'Recruiter assigned successfully',
            job
        });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({
            success: false,
            message: error.message
        });
    } finally {
        session.endSession();
    }
});

// Get employer's jobs
router.get('/employer-jobs', authenticate, authorizeRole('employer'), async (req, res) => {
    try {
        const jobs = await Job.find({ employerId: req.user._id })
            .populate('employerId recruiterID')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            jobs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Update job status
router.put('/update-status/:id', authenticate, async (req, res) => {
    try {
        const { status } = req.body;
        const jobId = req.params.id;

        const job = await Job.findByIdAndUpdate(
            jobId,
            { status },
            { new: true }
        ).populate('employerId recruiterID');

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Job status updated successfully',
            job
        });
    } catch (error) {
        console.error('Error updating job status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update job status'
        });
    }
});

// Add these routes
router.get('/applications/shortlisted', authenticate, getShortlistedCandidates);
router.post('/applications/:id/shortlist', authenticate, authorizeRole(['recruiter', 'employer']), updateApplicationStatus);

router.get('/pending', authenticateUser, getPendingJobs);

export default router;